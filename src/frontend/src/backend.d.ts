import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Clause {
    title: string;
    content: string;
    explanation: string;
}
export interface Right {
    description: string;
    party: string;
}
export interface Obligation {
    description: string;
    party: string;
}
export interface RevisionReminder {
    id: bigint;
    topic: string;
    active: boolean;
    owner: Principal;
    timesRevised: bigint;
    nextRevision: string;
}
export interface TimetableEntry {
    id: bigint;
    startTime: string;
    title: string;
    entryType: EntryType;
    endTime: string;
    owner: Principal;
    recurring: boolean;
    location: string;
}
export interface Quiz {
    id: string;
    title: string;
    owner: Principal;
    creationTimestamp: bigint;
    questions: Array<Question>;
}
export interface LegalAnalysis {
    owner: Principal;
    rights: Array<Right>;
    clauses: Array<Clause>;
    summary: string;
    obligations: Array<Obligation>;
    dates: Array<DateInfo>;
    parties: Array<Party>;
}
export interface Party {
    name: string;
    role: string;
}
export interface DateInfo {
    date: string;
    purpose: string;
}
export interface MedicalReport {
    id: string;
    domain: Domain;
    owner: Principal;
    file: ExternalBlob;
    isAnalysed: boolean;
    uploadTimestamp: bigint;
    analysis?: string;
}
export interface Question {
    correctAnswer: string;
    questionText: string;
    options: Array<string>;
}
export interface UserProfile {
    name: string;
}
export interface Note {
    id: string;
    title: string;
    content: string;
    domain: Domain;
    owner: Principal;
    isArchived: boolean;
    timestamp: bigint;
}
export enum Domain {
    legal = "legal",
    general = "general",
    medical = "medical"
}
export enum EntryType {
    other = "other",
    exam = "exam",
    deadline = "deadline",
    classes = "classes",
    studySession = "studySession"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createNote(title: string, content: string, domainText: string): Promise<string>;
    createRevisionReminder(topic: string, timesRevised: bigint, nextRevision: string): Promise<bigint>;
    createTimetableEntry(entryType: string, title: string, startTime: string, endTime: string, location: string, recurring: boolean): Promise<bigint>;
    deactivateReminder(reminderId: bigint): Promise<void>;
    deleteNote(noteId: string): Promise<void>;
    deleteTimetableEntry(entryId: bigint): Promise<void>;
    editNote(noteId: string, newTitle: string, newContent: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLegalAnalysis(documentId: string): Promise<LegalAnalysis>;
    getMedicalReport(reportId: string): Promise<MedicalReport>;
    getMedicalReportsCountForCaller(): Promise<bigint>;
    getNote(noteId: string): Promise<Note>;
    getNotesCountForCaller(): Promise<bigint>;
    getQuiz(quizId: string): Promise<Quiz>;
    getUserNotes(): Promise<Array<Note>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserQuizzes(): Promise<Array<Quiz>>;
    getUserReminders(): Promise<Array<RevisionReminder>>;
    getUserReports(): Promise<Array<MedicalReport>>;
    getUserTimetableEntries(): Promise<Array<TimetableEntry>>;
    isCallerAdmin(): Promise<boolean>;
    saveAnalysis(reportId: string, analysis: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveLegalAnalysis(documentId: string, clauses: Array<Clause>, obligations: Array<Obligation>, rights: Array<Right>, parties: Array<Party>, dates: Array<DateInfo>, summary: string): Promise<void>;
    saveQuiz(title: string, questions: Array<Question>): Promise<string>;
    updateReminder(reminderId: bigint, newTimesRevised: bigint, newNextRevision: string): Promise<void>;
    uploadMedicalReport(file: ExternalBlob, domainText: string): Promise<string>;
}
