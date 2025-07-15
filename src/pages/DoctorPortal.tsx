
import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DoctorSidebar } from '@/components/DoctorSidebar';
import { PatientsList } from '@/components/PatientsList';
import { PrescriptionForm } from '@/components/PrescriptionForm';
import { PatientDetails } from '@/components/PatientDetails';

export type TabType = 'patients' | 'prescriptions' | 'patient-details';

export interface Patient {
  id: string;
  name: string;
  age: number;
  lastVisit: string;
  symptoms?: string;
  possibleCauses?: string;
  lifestyleRecommendations?: string;
  medications?: string;
  audioUrl?: string;
}

const DoctorPortal = () => {
  const [activeTab, setActiveTab] = useState<TabType>('patients');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'John Doe',
      age: 35,
      lastVisit: '2024-01-15',
    },
    {
      id: '2',
      name: 'Jane Smith',
      age: 28,
      lastVisit: '2024-01-14',
    },
  ]);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab('patient-details');
  };

  const handlePatientUpdate = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    setSelectedPatient(updatedPatient);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'patients':
        return (
          <PatientsList 
            patients={patients} 
            onPatientSelect={handlePatientSelect}
            onPatientUpdate={handlePatientUpdate}
          />
        );
      case 'prescriptions':
        return <PrescriptionForm patients={patients} />;
      case 'patient-details':
        return selectedPatient ? (
          <PatientDetails 
            patient={selectedPatient} 
            onPatientUpdate={handlePatientUpdate}
          />
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Please select a patient from the patients list
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DoctorSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-white flex items-center px-6">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-2xl font-bold text-primary">Doctor Portal</h1>
          </header>
          
          <div className="flex-1 p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DoctorPortal;
