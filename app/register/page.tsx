"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { register as registerRequest } from "../shared/lib/auth-api";
import { clearAuthSession, saveAuthSession } from "../shared/lib/auth-storage";
import { registerSchema, type RegisterFormValues } from "../shared/schemas/auth";

export default function Register() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormValues) => {
    setSubmitError(null);

    try {
      clearAuthSession();
      const session = await registerRequest({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      saveAuthSession(session);
      router.replace("/");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo crear la cuenta.";
      setSubmitError(message);
    }
  };

  return (
    <div className="flex min-h-screen py-7 w-full max-w-7xl mx-auto">
      <div className="md:w-3/5 w-full flex flex-col justify-center items-center px-8">
        <span className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-orange-700 mb-4">Crear Cuenta</h1>
          <p className="text-gray-500 mb-8">Registrate para comenzar</p>
        </span>

        <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className={`mt-1 block w-full rounded-lg px-3 py-3 focus:outline-none text-gray-700 focus:ring-1 ${
                errors.name
                  ? "border border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              }`}
              placeholder="Tu Nombre"
            />
            {errors.name ? <p className="text-red-500 text-sm mt-1">{errors.name.message}</p> : null}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className={`mt-1 block w-full rounded-lg px-3 py-3 focus:outline-none text-gray-700 focus:ring-1 ${
                errors.email
                  ? "border border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              }`}
              placeholder="tuemail@gmail.com"
            />
            {errors.email ? <p className="text-red-500 text-sm mt-1">{errors.email.message}</p> : null}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              className={`mt-1 block w-full rounded-lg px-3 py-3 focus:outline-none text-gray-700 focus:ring-1 ${
                errors.password
                  ? "border border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              }`}
              placeholder="********"
            />
            {errors.password ? <p className="text-red-500 text-sm mt-1">{errors.password.message}</p> : null}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword")}
              className={`mt-1 block w-full rounded-lg px-3 py-3 focus:outline-none text-gray-700 focus:ring-1 ${
                errors.confirmPassword
                  ? "border border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              }`}
              placeholder="********"
            />
            {errors.confirmPassword ? (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            ) : null}
          </div>

          {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Registrando..." : "Registrarse"}
            </button>
          </div>
        </form>

        <div className="mt-6 w-full max-w-md">
          <p className="text-gray-500 text-center">o registrate con</p>
          <div className="flex flex-col gap-2 mt-4 w-full">
            <button className="flex items-center gap-2 font-semibold px-4 py-3 border border-amber-950 justify-center text-amber-950 rounded-lg w-full hover:bg-gray-100">
              <svg width="800px" height="800px" viewBox="0 0 32 32" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30.0014 16.3109C30.0014 15.1598 29.9061 14.3198 29.6998 13.4487H16.2871V18.6442H24.1601C24.0014 19.9354 23.1442 21.8798 21.2394 23.1864L21.2127 23.3604L25.4536 26.58L25.7474 26.6087C28.4458 24.1665 30.0014 20.5731 30.0014 16.3109Z" fill="#4285F4" />
                <path d="M16.2863 29.9998C20.1434 29.9998 23.3814 28.7553 25.7466 26.6086L21.2386 23.1863C20.0323 24.0108 18.4132 24.5863 16.2863 24.5863C12.5086 24.5863 9.30225 22.1441 8.15929 18.7686L7.99176 18.7825L3.58208 22.127L3.52441 22.2841C5.87359 26.8574 10.699 29.9998 16.2863 29.9998Z" fill="#34A853" />
                <path d="M8.15964 18.769C7.85806 17.8979 7.68352 16.9645 7.68352 16.0001C7.68352 15.0356 7.85806 14.1023 8.14377 13.2312L8.13578 13.0456L3.67083 9.64746L3.52475 9.71556C2.55654 11.6134 2.00098 13.7445 2.00098 16.0001C2.00098 18.2556 2.55654 20.3867 3.52475 22.2845L8.15964 18.769Z" fill="#FBBC05" />
                <path d="M16.2864 7.4133C18.9689 7.4133 20.7784 8.54885 21.8102 9.4978L25.8419 5.64C23.3658 3.38445 20.1435 2 16.2864 2C10.699 2 5.8736 5.1422 3.52441 9.71549L8.14345 13.2311C9.30229 9.85555 12.5086 7.4133 16.2864 7.4133Z" fill="#EB4335" />
              </svg>
              Google
            </button>
            <button className="flex items-center gap-2 font-semibold px-4 py-3 border border-amber-950 justify-center text-amber-950 rounded-lg w-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" aria-label="Facebook" role="img" className="w-5 h-5" viewBox="0 0 512 512">
                <rect width="512" height="512" rx="15%" fill="#1877f2" />
                <path d="M355.6 330l11.4-74h-71v-48c0-20.2 9.9-40 41.7-40H370v-63s-29.3-5-57.3-5c-58.5 0-96.7 35.4-96.7 99.6V256h-65v74h65v182h80V330h59.6z" fill="#ffffff" />
              </svg>
              Facebook
            </button>
          </div>
        </div>

        <p className="mt-8 text-gray-500">
          si ya estas registrado{" "}
          <a href="/login" className="text-orange-500 hover:underline font-medium">
            Inicia Sesión
          </a>
        </p>
      </div>

      {/* Panel decorativo derecho */}
      <div className="w-1/2 rounded-2xl hidden relative overflow-hidden bg-orange-500 md:flex flex-col justify-end pb-10">

        {/* Imagen de fondo — cubre todo el panel */}
        <Image
          src="/register.png"
          fill
          className="object-cover object-center"
          alt="Tienda de vegetales"
          sizes="50vw"
          priority
        />

        {/* Overlay naranja semitransparente encima de la imagen */}
        <div className="absolute inset-0 bg-orange-500/60" />

        {/* Logo — arriba a la izquierda */}
        <div className="absolute top-1/4 left-8 z-10">
          <p className="text-white text-[60px] font-extrabold leading-none tracking-tight">Grocery</p>
          <span className="inline-block border-2 border-white rounded-full px-3 py-0.5 text-white text-[60px] font-extrabold leading-none mt-1">
            Pro
          </span>
        </div>

        {/* Texto pie — abajo a la izquierda */}
        <h3 className="relative z-10 ml-10 text-white text-4xl font-bold leading-tight drop-shadow-md">
          Únete y organiza<br />tus compras
        </h3>
      </div>
    </div>
  );
}
