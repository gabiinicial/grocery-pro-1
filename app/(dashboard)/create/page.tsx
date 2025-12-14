"use client";
import { FormValues } from "@/app/shared/types/create";
import { useForm } from "react-hook-form";

// components/CreateListForm.tsx
export default function CreateListForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log("Datos enviados:", data);
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-gray-700 mb-6">Crear Listas</h2>
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        {/* Nombre y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
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
              className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Categoría */}
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
              className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Selecciona una categoría</option>
              <option value="limpieza">Limpieza</option>
              <option value="comida">Comida</option>
              <option value="hogar">Hogar</option>
            </select>
          </div>
        </div>

        {/* Descripción */}
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
            className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          ></textarea>
        </div>

        {/* Drag & Drop File Upload (pendiente de integración con lógica real) */}
        <div className="border-2 border-dashed border-orange-400 rounded-lg p-6 text-center bg-gray-100">
          <div className="flex flex-col items-center">
            <div className="text-orange-500 mb-2">
              {/* SVG se mantiene igual */}
            </div>
            <p className="text-sm text-gray-500">
              Drag your file(s) to start uploading or click
            </p>
          </div>
        </div>

        {/* Botón Crear Lista */}
        <div className="flex justify-start">
          <button
            type="submit"
            className="bg-orange-500 text-white py-2 px-6 rounded-lg font-medium hover:bg-orange-600 transition"
          >
            Crear Lista
          </button>
        </div>
      </form>
    </div>
  );
}