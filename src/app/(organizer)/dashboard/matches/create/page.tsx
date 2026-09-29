'use client';

import InputField from '@/components/app/form/input-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import StepNumber from '@/features/matches/components/step-number';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function CreateMatchPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // const form = useForm({
  //   resolver: zodResolver()
  // })

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between text-muted-foreground flex-wrap text-sm gap-y-6 md:text-base">
        <Link
          href="/dashboard/matches"
          className="flex items-center gap-1 hover:text-primary transition duration-200 hover:underline underline-offset-4"
        >
          <ChevronLeftIcon className="size-5" />
          Kembali ke Pertandingan
        </Link>
        <span>Langkah 1 dari 4</span>
      </div>

      <Card>
        <CardContent className="flex items-center justify-around">
          <StepNumber
            number={1}
            label="Info Basis"
            isActive={currentStep === 1}
            done={currentStep > 1}
          />
          <StepNumber
            number={2}
            label="Peserta & Pembayaran"
            isActive={currentStep === 2}
            done={currentStep > 2}
          />
          <StepNumber
            number={3}
            label="Format Pertandingan"
            isActive={currentStep === 3}
            done={currentStep > 3}
          />
          <StepNumber
            number={4}
            label="Tinjau & Konfirmasi"
            isActive={currentStep === 4}
            done={currentStep > 4}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <form>
            {currentStep === 1 && renderStepOneForm()}
            {currentStep === 2 && renderStepTwoForm()}
            {currentStep === 3 && renderStepThreeForm()}
            {currentStep === 4 && renderStepFourForm()}
          </form>
        </CardContent>
        <CardFooter className="justify-between">
          <Button
            variant="secondary"
            className="cursor-pointer"
            onClick={() => setCurrentStep((step) => Math.max(step - 1, 1))}
          >
            <ChevronLeftIcon />
            Kembali
          </Button>

          <Button
            className="cursor-pointer"
            onClick={() => setCurrentStep((step) => Math.min(step + 1, 4))}
          >
            Lanjutkan
            <ChevronRightIcon />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function renderStepOneForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-xl font-bold">Langkah 1: Info Basis</h1>
        <p className="text-muted-foreground">
          Atur detail dasar dan jadwal untuk sesi olahraga yang akan datang.
        </p>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {/* <Controller name="" control={form.control} render={({ field, fieldState }) => <InputField />} /> */}
      </div>
    </div>
  );
}

function renderStepTwoForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-xl font-bold">Langkah 2: Peserta & Pembayaran</h1>
        <p className="text-muted-foreground">
          Atur kapasitas peserta dan tentukan rekening bank komunitas untuk
          penerimaan pembayaran.
        </p>
      </div>

      <div className="grid grid-cols-6 gap-2"></div>
    </div>
  );
}

function renderStepThreeForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-xl font-bold">
          Langkah 3: Pilih Format Pertandingan
        </h1>
        <p className="text-muted-foreground">
          Tentukan bagaimana pertandingan dan pasangan akan disusun selama sesi
          berlangsung.
        </p>
      </div>

      <div className="grid grid-cols-6 gap-2"></div>
    </div>
  );
}

function renderStepFourForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-xl font-bold">Langkah 4: Tinjau & Konfirmasi</h1>
        <p className="text-muted-foreground">
          Pastikan kembali pengaturan sesi sebelum membuka pendaftaran untuk
          anggota.
        </p>
      </div>

      <div className="grid grid-cols-6 gap-2"></div>
    </div>
  );
}
