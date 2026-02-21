import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Storage "blob-storage/Storage";

module {
  type OldUserProfile = {
    name : Text;
  };

  type Domain = { #medical; #legal; #general };

  type OldNote = {
    id : Text;
    owner : Principal;
    title : Text;
    content : Text;
    timestamp : Int;
    isArchived : Bool;
  };

  type OldMedicalReport = {
    id : Text;
    owner : Principal;
    file : Storage.ExternalBlob;
    analysis : ?Text;
    isAnalysed : Bool;
    uploadTimestamp : Int;
  };

  type OldActor = {
    notes : Map.Map<Text, OldNote>;
    medicalReports : Map.Map<Text, OldMedicalReport>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    nextId : Nat;
    nextTimestamp : Int;
  };

  type NewUserProfile = {
    name : Text;
  };

  type NewNote = {
    id : Text;
    owner : Principal;
    title : Text;
    content : Text;
    timestamp : Int;
    isArchived : Bool;
    domain : Domain;
  };

  type NewMedicalReport = {
    id : Text;
    owner : Principal;
    file : Storage.ExternalBlob;
    analysis : ?Text;
    isAnalysed : Bool;
    uploadTimestamp : Int;
    domain : Domain;
  };

  type NewActor = {
    notes : Map.Map<Text, NewNote>;
    medicalReports : Map.Map<Text, NewMedicalReport>;
    userProfiles : Map.Map<Principal, NewUserProfile>;
    nextId : Nat;
    nextTimestamp : Int;
    _nextTimetableId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newNotes = old.notes.map<Text, OldNote, NewNote>(
      func(_id, oldNote) {
        { oldNote with domain = #general };
      }
    );

    let newMedicalReports = old.medicalReports.map<Text, OldMedicalReport, NewMedicalReport>(
      func(_id, oldReport) {
        { oldReport with domain = #general };
      }
    );

    {
      old with
      notes = newNotes;
      medicalReports = newMedicalReports;
      _nextTimetableId = 0;
    };
  };
};
