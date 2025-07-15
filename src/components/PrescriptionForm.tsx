
import { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Patient } from '@/pages/DoctorPortal';
import { MongoDBService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface PrescriptionFormProps {
  patients: Patient[];
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Prescription {
  patientId: string;
  patientName: string;
  date: string;
  diagnosis: string;
  medications: Medication[];
  instructions: string;
  followUpDate: string;
}

export function PrescriptionForm({ patients }: PrescriptionFormProps) {
  const { toast } = useToast();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [diagnosis, setDiagnosis] = useState('');
  const [instructions, setInstructions] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [medications, setMedications] = useState<Medication[]>([
    { id: '1', name: '', dosage: '', frequency: '', duration: '' }
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const addMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      frequency: '',
      duration: ''
    };
    setMedications([...medications, newMedication]);
  };

  const removeMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(medications.filter(med => med.id !== id));
    }
  };

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const savePrescription = async () => {
    if (!selectedPatientId || !diagnosis.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a patient and enter a diagnosis.",
        variant: "destructive",
      });
      return;
    }

    const selectedPatient = patients.find(p => p.id === selectedPatientId);
    if (!selectedPatient) return;

    const prescription: Prescription = {
      patientId: selectedPatientId,
      patientName: selectedPatient.name,
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      medications: medications.filter(med => med.name.trim()),
      instructions,
      followUpDate
    };

    setIsSaving(true);
    try {
      // Save prescription to MongoDB
      await MongoDBService.savePrescription(prescription);
      
      toast({
        title: "Prescription Saved",
        description: `Prescription for ${selectedPatient.name} has been saved to MongoDB successfully.`,
      });

      // Reset form
      setSelectedPatientId('');
      setDiagnosis('');
      setInstructions('');
      setFollowUpDate('');
      setMedications([{ id: '1', name: '', dosage: '', frequency: '', duration: '' }]);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save prescription. Please check your MongoDB configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Create Prescription</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prescription Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Patient Selection */}
          <div className="space-y-2">
            <Label htmlFor="patient">Select Patient</Label>
            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name} (Age: {patient.age})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Diagnosis */}
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Textarea
              id="diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Enter diagnosis..."
              rows={3}
            />
          </div>

          {/* Medications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Medications</Label>
              <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </div>

            {medications.map((medication, index) => (
              <Card key={medication.id} className="p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                  <div>
                    <Label>Medicine Name</Label>
                    <Input
                      value={medication.name}
                      onChange={(e) => updateMedication(medication.id, 'name', e.target.value)}
                      placeholder="Medicine name"
                    />
                  </div>
                  <div>
                    <Label>Dosage</Label>
                    <Input
                      value={medication.dosage}
                      onChange={(e) => updateMedication(medication.id, 'dosage', e.target.value)}
                      placeholder="e.g., 500mg"
                    />
                  </div>
                  <div>
                    <Label>Frequency</Label>
                    <Input
                      value={medication.frequency}
                      onChange={(e) => updateMedication(medication.id, 'frequency', e.target.value)}
                      placeholder="e.g., Twice daily"
                    />
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input
                      value={medication.duration}
                      onChange={(e) => updateMedication(medication.id, 'duration', e.target.value)}
                      placeholder="e.g., 7 days"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeMedication(medication.id)}
                      disabled={medications.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Special Instructions</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Any special instructions for the patient..."
              rows={3}
            />
          </div>

          {/* Follow-up Date */}
          <div className="space-y-2">
            <Label htmlFor="followUp">Follow-up Date</Label>
            <Input
              id="followUp"
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
            />
          </div>

          {/* Save Button */}
          <Button onClick={savePrescription} className="w-full" disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Prescription to MongoDB'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
