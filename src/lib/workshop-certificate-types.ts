export type WorkshopCertificate = {
  id: string;
  publicToken: string;
  studentName: string;
  workshopTitle: string;
  workshopSubtitle: string;
  workshopOverview: string;
  workshopDate: string;
  duration: string;
  durationType: string;
  venue: string;
  institutionPartnerName: string;
  institutionPartnerLogoUrl: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  publicUrl: string;
};

export type WorkshopCertificateForm = Omit<
  WorkshopCertificate,
  "id" | "publicToken" | "createdAt" | "updatedAt" | "publicUrl"
>;

export const EMPTY_WORKSHOP_CERTIFICATE_FORM: WorkshopCertificateForm = {
  studentName: "",
  workshopTitle: "ARTIFICIAL INTELLIGENCE & MACHINE LEARNING",
  workshopSubtitle: "FROM BASICS TO REAL-WORLD APPLICATIONS",
  workshopOverview:
    "This workshop provided hands-on knowledge of AI & ML concepts, including data preprocessing, model building, training, and evaluation using real-world datasets and Python tools.",
  workshopDate: "",
  duration: "",
  durationType: "",
  venue: "AZDeploy Academy, Belagavi, Karnataka",
  institutionPartnerName: "",
  institutionPartnerLogoUrl: "",
  isActive: true,
};
