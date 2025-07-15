
import { useState } from 'react';
import { Upload, Mic, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Patient } from '@/pages/DoctorPortal';
import { AudioUpload } from '@/components/AudioUpload';
import { GeminiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface PatientsListProps {
  patients: Patient[];
  onPatientSelect: (patient: Patient) => void;
  onPatientUpdate: (patient: Patient) => void;
}

export function PatientsList({ patients, onPatientSelect, onPatientUpdate }: PatientsListProps) {
  const [uploadingPatientId, setUploadingPatientId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAudioUpload = async (patientId: string, audioFile: File) => {
    setUploadingPatientId(patientId);
    
    try {
      // Process audio with Gemini AI
      const audioData = await GeminiService.processAudio(audioFile);
      
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        const updatedPatient = {
          ...patient,
          ...audioData,
          audioUrl: URL.createObjectURL(audioFile)
        };
        onPatientUpdate(updatedPatient);
        
        toast({
          title: "Audio processed successfully",
          description: "Patient information has been extracted and updated using Gemini AI.",
        });
      }
    } catch (error) {
      toast({
        title: "Error processing audio",
        description: error instanceof Error ? error.message : "Failed to process the audio file. Please check your API configuration.",
        variant: "destructive",
      });
    } finally {
      setUploadingPatientId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Patients Consulted</h2>
        <Badge variant="secondary" className="text-sm">
          {patients.length} Total Patients
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {patients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {patient.name}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Last visit: {patient.lastVisit}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Age:</span> {patient.age}
                </div>
                {patient.symptoms && (
                  <div className="col-span-2">
                    <Badge variant="outline" className="text-xs">
                      AI Processed
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <AudioUpload
                  onAudioUpload={(file) => handleAudioUpload(patient.id, file)}
                  isUploading={uploadingPatientId === patient.id}
                />
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onPatientSelect(patient)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
