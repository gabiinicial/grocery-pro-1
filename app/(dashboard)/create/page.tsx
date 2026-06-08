"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useApp } from "../../shared/context/app-context";
import { createList } from "../../shared/services/list.service";
import type { CreateShoppingListInput } from "../../shared/types/list";

type FormValues = {
  name: string;
  category: string;
  description: string;
};

export default function CreateListForm() {
  const router = useRouter();
  const { refreshLists } = useApp();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: "", category: "", description: "" },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    try {
      const input: CreateShoppingListInput = {
        name: data.name,
        ...(data.description && { description: data.description }),
      };
      await createList(input);
      await refreshLists();
      router.push("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo crear la lista.";
      setSubmitError(message);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-gray-700 mb-6">Crear Listas</h2>
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "El nombre es obligatorio" })}
              placeholder="Nombres"
              className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Selecciona una categoría
            </label>
            <select
              id="category"
              {...register("category")}
              className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Selecciona una categoría</option>
              <option value="limpieza">Limpieza</option>
              <option value="comida">Comida</option>
              <option value="hogar">Hogar</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Descripción
          </label>
          <textarea
            id="description"
            {...register("description")}
            placeholder="Tu descripción aquí"
            rows={4}
            className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="border-2 border-dashed border-orange-400 rounded-lg p-6 text-center bg-gray-100">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500">
              Drag your file(s) to start uploading or click
            </p>
          </div>
        </div>

        {submitError && (
          <p className="text-sm text-red-600">{submitError}</p>
        )}

        <div className="flex justify-start">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-500 text-white py-2 px-6 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creando..." : "Crear Lista"}
          </button>
        </div>
      </form>
    </div>
  );
}
