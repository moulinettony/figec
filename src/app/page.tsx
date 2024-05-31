"use client";

import { useState } from 'react';

const EmailForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    adresse: '',
    ville: '',
    codePostal: '',
    email: '',
    telephone: '',
    anneesExperiences: '',
    domaineExpertise: '',
    posteDesire: '',
    message: ''
  });
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        formDataToSend.append(key, formData[key as keyof typeof formData]);
      }
    }
    if (file) {
      formDataToSend.append('file', file);
    }

    const response = await fetch('/api/sendmail', {
      method: 'POST',
      body: formDataToSend,
    });

    const result = await response.json();
    console.log('Email sent successfully:', result);
  };

  return (
    <section className="flex w-full flex-col items-center justify-between">
      <div className="relative flex h-auto w-full flex-col items-center justify-center">
        <div className="relative px-4 w-full lg-w-1/2">
          <div className="container relative mx-auto my-4 w-full max-w-7xl sm:my-10">
            <div className="text-center">
              <h2 className="freestyle lg:text-[50px] text-[40px] text-[#C00000] freestyle font-bold tracking-tight">
                Soumettez Votre Candidature
              </h2>
              <p className="calibri lg:text-[16px] text-[14px] leading-8 text-[#7A7A7A]">
                Remplissez le formulaire et déposez votre CV
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-[600px] mx-auto rounded-bl-[70px] p-10 bg-[#06225A] mt-10 space-y-6"
            >
              <div className="space-y-2 flex w-full flex-col items-start justify-start gap-2">
                <input
                  placeholder="Nom"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="flex h-10 text-white rounded-none border-[#ffffff9c] border-t-0 border-x-0 border bg-transparent px-3 py-2 text-sm w-full"
                />
                <input
                  placeholder="Prénom"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="flex h-10 text-white rounded-none border-[#ffffff9c] border-t-0 border-x-0 border bg-transparent px-3 py-2 text-sm w-full"
                />
                <input
                  placeholder="Adresse"
                  name="adresse"
                  type="text"
                  value={formData.adresse}
                  onChange={handleChange}
                  className="flex h-10 text-white rounded-none border-[#ffffff9c] border-t-0 border-x-0 border bg-transparent px-3 py-2 text-sm w-full"
                />
                <input
                  placeholder="Ville"
                  name="ville"
                  type="text"
                  value={formData.ville}
                  onChange={handleChange}
                  className="flex h-10 text-white rounded-none border-[#ffffff9c] border-t-0 border-x-0 border bg-transparent px-3 py-2 text-sm w-full"
                />
                <input
                  placeholder="Code postal"
                  name="codePostal"
                  type="text"
                  value={formData.codePostal}
                  onChange={handleChange}
                  className="flex h-10 text-white rounded-none border-[#ffffff9c] border-t-0 border-x-0 border bg-transparent px-3 py-2 text-sm w-full"
                />
                <input
                  placeholder="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="flex h-10 text-white rounded-none border-[#ffffff9c] border-t-0 border-x-0 border bg-transparent px-3 py-2 text-sm w-full"
                />
                <input
                  placeholder="Téléphone"
                  name="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="flex h-10 text-white rounded-none border-[#ffffff9c] border-t-0 border-x-0 border bg-transparent px-3 py-2 text-sm w-full"
                />
                <input
                  placeholder="Années d’expériences"
                  name="anneesExperiences"
                  type="text"
                  value={formData.anneesExperiences}
                  onChange={handleChange}
                  className="flex h-10 text-white rounded-none border-[#ffffff9c] border-t-0 border-x-0 border bg-transparent px-3 py-2 text-sm w-full"
                />
                <input
                  placeholder="Domaine d’expertise"
                  name="domaineExpertise"
                  type="text"
                  value={formData.domaineExpertise}
                  onChange={handleChange}
                  className="flex h-10 text-white rounded-none border-[#ffffff9c] border-t-0 border-x-0 border bg-transparent px-3 py-2 text-sm w-full"
                />
                <input
                  placeholder="Poste désiré"
                  name="posteDesire"
                  type="text"
                  value={formData.posteDesire}
                  onChange={handleChange}
                  className="flex h-10 text-white rounded-none border-[#ffffff9c] border-t-0 border-x-0 border bg-transparent px-3 py-2 text-sm w-full"
                />
                <textarea
                  placeholder="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="flex h-24 text-white rounded-none border-[#ffffff9c] border-t-0 border-x-0 border bg-transparent px-3 py-2 text-sm w-full"
                ></textarea>
                <input
                  type="file"
                  name="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="flex h-10 text-white rounded-none border-[#ffffff9c] border-t-0 border-x-0 border bg-transparent px-3 py-2 text-sm w-full"
                />
              </div>
              <div className="flex w-full flex-row items-center gap-2">
                <button
                  type="submit"
                  className="border border-white text-white text-[16px] font-bold h-10 px-4 py-2 rounded-[5px]"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailForm;
