import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  // Domain type for document classification
  public type Domain = {
    #medical;
    #legal;
    #general;
  };

  // Note type with comparison modules
  type Note = {
    id : Text;
    owner : Principal;
    title : Text;
    content : Text;
    timestamp : Int;
    isArchived : Bool;
    domain : Domain;
  };

  module Note {
    public func compareByTimestamp(note1 : Note, note2 : Note) : Order.Order {
      Int.compare(note1.timestamp, note2.timestamp);
    };
  };

  // MedicalReport type with comparison modules
  type MedicalReport = {
    id : Text;
    owner : Principal;
    file : Storage.ExternalBlob;
    analysis : ?Text;
    isAnalysed : Bool;
    uploadTimestamp : Int;
    domain : Domain;
  };

  module MedicalReport {
    public func compareByTimestamp(report1 : MedicalReport, report2 : MedicalReport) : Order.Order {
      Int.compare(report1.uploadTimestamp, report2.uploadTimestamp);
    };
  };

  // LegalAnalysis type
  type LegalAnalysis = {
    owner : Principal;
    clauses : [Clause];
    obligations : [Obligation];
    rights : [Right];
    parties : [Party];
    dates : [DateInfo];
    summary : Text;
  };

  type Clause = {
    title : Text;
    content : Text;
    explanation : Text;
  };

  type Obligation = {
    party : Text;
    description : Text;
  };

  type Right = {
    party : Text;
    description : Text;
  };

  type Party = {
    name : Text;
    role : Text;
  };

  type DateInfo = {
    date : Text;
    purpose : Text;
  };

  // Smart timetable types
  type TimetableEntry = {
    id : Nat;
    owner : Principal;
    entryType : EntryType;
    title : Text;
    startTime : Text;
    endTime : Text;
    location : Text;
    recurring : Bool;
  };

  type EntryType = {
    #classes;
    #studySession;
    #deadline;
    #exam;
    #other;
  };

  // Quiz types
  type Quiz = {
    id : Text;
    owner : Principal;
    title : Text;
    questions : [Question];
    creationTimestamp : Int;
  };

  type Question = {
    questionText : Text;
    options : [Text];
    correctAnswer : Text;
  };

  // RevisionReminder type
  type RevisionReminder = {
    id : Nat;
    owner : Principal;
    topic : Text;
    timesRevised : Nat;
    nextRevision : Text;
    active : Bool;
  };

  // Storage for all new types
  let notes = Map.empty<Text, Note>();
  let medicalReports = Map.empty<Text, MedicalReport>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let legalAnalyses = Map.empty<Text, LegalAnalysis>();
  let timetableEntries = Map.empty<Nat, TimetableEntry>();
  let quizzes = Map.empty<Text, Quiz>();
  let revisionReminders = Map.empty<Nat, RevisionReminder>();

  var nextId : Nat = 0;
  var nextTimestamp : Int = 0;
  var _nextTimetableId = 0;

  func generateId() : Text {
    let id = nextId.toText();
    nextId += 1;
    id;
  };

  func generateTimestamp() : Int {
    let ts = nextTimestamp;
    nextTimestamp += 1;
    ts;
  };

  // Utility functions for domain and entry type conversion
  func textToDomain(text : Text) : Domain {
    switch (text) {
      case ("medical") { #medical };
      case ("legal") { #legal };
      case ("general") { #general };
      case _ { #general };
    };
  };

  func textToEntryType(text : Text) : EntryType {
    switch (text) {
      case ("classes") { #classes };
      case ("study_session") { #studySession };
      case ("deadline") { #deadline };
      case ("exam") { #exam };
      case _ { #other };
    };
  };

  // User profile operations
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Note operations
  public shared ({ caller }) func createNote(title : Text, content : Text, domainText : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create notes");
    };

    let noteId = generateId();
    let note : Note = {
      id = noteId;
      owner = caller;
      title;
      content;
      timestamp = generateTimestamp();
      isArchived = false;
      domain = textToDomain(domainText);
    };

    notes.add(noteId, note);
    noteId;
  };

  public shared ({ caller }) func editNote(noteId : Text, newTitle : Text, newContent : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can edit notes");
    };

    switch (notes.get(noteId)) {
      case (null) { Runtime.trap("Note not found") };
      case (?note) {
        if (note.owner != caller) {
          Runtime.trap("Unauthorized: Can only edit your own notes");
        };
        let updatedNote : Note = {
          note with
          title = newTitle;
          content = newContent;
          timestamp = generateTimestamp();
        };
        notes.add(noteId, updatedNote);
      };
    };
  };

  public query ({ caller }) func getUserNotes() : async [Note] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view notes");
    };

    notes.values().toArray().filter(func(n) { n.owner == caller and not n.isArchived }).sort(Note.compareByTimestamp);
  };

  public query ({ caller }) func getNote(noteId : Text) : async Note {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view notes");
    };

    switch (notes.get(noteId)) {
      case (null) { Runtime.trap("Note not found") };
      case (?note) {
        if (note.owner != caller) {
          Runtime.trap("Unauthorized: Can only view your own notes");
        };
        note;
      };
    };
  };

  public shared ({ caller }) func deleteNote(noteId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete notes");
    };

    switch (notes.get(noteId)) {
      case (null) { Runtime.trap("Note not found") };
      case (?note) {
        if (note.owner != caller) {
          Runtime.trap("Unauthorized: Can only delete your own notes");
        };
        notes.remove(noteId);
      };
    };
  };

  public query ({ caller }) func getNotesCountForCaller() : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view note counts");
    };

    notes.values().toArray().filter(func(n) { n.owner == caller and not n.isArchived }).size();
  };

  // Medical report operations
  public shared ({ caller }) func uploadMedicalReport(file : Storage.ExternalBlob, domainText : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can upload medical reports");
    };

    let reportId = generateId();
    let report : MedicalReport = {
      id = reportId;
      owner = caller;
      file;
      analysis = null;
      isAnalysed = false;
      uploadTimestamp = generateTimestamp();
      domain = textToDomain(domainText);
    };

    medicalReports.add(reportId, report);
    reportId;
  };

  public shared ({ caller }) func saveAnalysis(reportId : Text, analysis : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save analyses");
    };

    switch (medicalReports.get(reportId)) {
      case (null) { Runtime.trap("Medical report not found") };
      case (?report) {
        if (report.owner != caller) {
          Runtime.trap("Unauthorized: Can only analyze your own reports");
        };
        let updatedReport : MedicalReport = {
          report with
          analysis = ?analysis;
          isAnalysed = true;
        };
        medicalReports.add(reportId, updatedReport);
      };
    };
  };

  public query ({ caller }) func getUserReports() : async [MedicalReport] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view reports");
    };

    medicalReports.values().toArray().filter(func(r) { r.owner == caller }).sort(MedicalReport.compareByTimestamp);
  };

  public query ({ caller }) func getMedicalReport(reportId : Text) : async MedicalReport {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view reports");
    };

    switch (medicalReports.get(reportId)) {
      case (null) { Runtime.trap("Medical report not found") };
      case (?report) {
        if (report.owner != caller) {
          Runtime.trap("Unauthorized: Can only view your own reports");
        };
        report;
      };
    };
  };

  public query ({ caller }) func getMedicalReportsCountForCaller() : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view report counts");
    };

    medicalReports.values().toArray().filter(func(r) { r.owner == caller }).size();
  };

  // Legal analysis operations
  public shared ({ caller }) func saveLegalAnalysis(documentId : Text, clauses : [Clause], obligations : [Obligation], rights : [Right], parties : [Party], dates : [DateInfo], summary : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save analyses");
    };

    let legalAnalysis : LegalAnalysis = {
      owner = caller;
      clauses;
      obligations;
      rights;
      parties;
      dates;
      summary;
    };

    legalAnalyses.add(documentId, legalAnalysis);
  };

  public query ({ caller }) func getLegalAnalysis(documentId : Text) : async LegalAnalysis {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view legal analysis");
    };

    switch (legalAnalyses.get(documentId)) {
      case (?analysis) {
        if (analysis.owner != caller) {
          Runtime.trap("Unauthorized: Can only view your own legal analysis");
        };
        analysis;
      };
      case (null) { Runtime.trap("Legal analysis not found") };
    };
  };

  // Timetable operations
  public shared ({ caller }) func createTimetableEntry(entryType : Text, title : Text, startTime : Text, endTime : Text, location : Text, recurring : Bool) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create timetable entries");
    };

    let entryId = _nextTimetableId;
    _nextTimetableId += 1;

    let entry : TimetableEntry = {
      id = entryId;
      owner = caller;
      entryType = textToEntryType(entryType);
      title;
      startTime;
      endTime;
      location;
      recurring;
    };

    timetableEntries.add(entryId, entry);
    entryId;
  };

  public shared ({ caller }) func deleteTimetableEntry(entryId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete timetable entries");
    };

    switch (timetableEntries.get(entryId)) {
      case (null) { Runtime.trap("Timetable entry not found") };
      case (?entry) {
        if (entry.owner != caller) {
          Runtime.trap("Unauthorized: Can only delete your own timetable entries");
        };
        timetableEntries.remove(entryId);
      };
    };
  };

  public query ({ caller }) func getUserTimetableEntries() : async [TimetableEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view timetable entries");
    };

    timetableEntries.values().toArray().filter(func(e) { e.owner == caller });
  };

  // Quiz operations
  public shared ({ caller }) func saveQuiz(title : Text, questions : [Question]) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create quizzes");
    };

    let quizId = generateId();
    let quiz : Quiz = {
      id = quizId;
      owner = caller;
      title;
      questions;
      creationTimestamp = generateTimestamp();
    };

    quizzes.add(quizId, quiz);
    quizId;
  };

  public query ({ caller }) func getUserQuizzes() : async [Quiz] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view quizzes");
    };

    quizzes.values().toArray().filter(func(q) { q.owner == caller });
  };

  public query ({ caller }) func getQuiz(quizId : Text) : async Quiz {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view quizzes");
    };

    switch (quizzes.get(quizId)) {
      case (?quiz) {
        if (quiz.owner != caller) {
          Runtime.trap("Unauthorized: Can only view your own quizzes");
        };
        quiz;
      };
      case (null) { Runtime.trap("Quiz not found") };
    };
  };

  // Revision reminder operations
  public shared ({ caller }) func createRevisionReminder(topic : Text, timesRevised : Nat, nextRevision : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create reminders");
    };

    let reminderId = _nextTimetableId;
    _nextTimetableId += 1;

    let reminder : RevisionReminder = {
      id = reminderId;
      owner = caller;
      topic;
      timesRevised;
      nextRevision;
      active = true;
    };

    revisionReminders.add(reminderId, reminder);
    reminderId;
  };

  public query ({ caller }) func getUserReminders() : async [RevisionReminder] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view reminders");
    };

    revisionReminders.values().toArray().filter(func(r) { r.owner == caller });
  };

  public shared ({ caller }) func updateReminder(reminderId : Nat, newTimesRevised : Nat, newNextRevision : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update reminders");
    };

    switch (revisionReminders.get(reminderId)) {
      case (null) { Runtime.trap("Reminder not found") };
      case (?reminder) {
        if (reminder.owner != caller) {
          Runtime.trap("Unauthorized: Can only update your own reminders");
        };
        let updatedReminder = {
          reminder with
          timesRevised = newTimesRevised;
          nextRevision = newNextRevision;
        };
        revisionReminders.add(reminderId, updatedReminder);
      };
    };
  };

  public shared ({ caller }) func deactivateReminder(reminderId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can deactivate reminders");
    };

    switch (revisionReminders.get(reminderId)) {
      case (null) { Runtime.trap("Reminder not found") };
      case (?reminder) {
        if (reminder.owner != caller) {
          Runtime.trap("Unauthorized: Can only deactivate your own reminders");
        };
        let updatedReminder = { reminder with active = false };
        revisionReminders.add(reminderId, updatedReminder);
      };
    };
  };
};
