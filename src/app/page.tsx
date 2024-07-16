"use client";

import QnaComponent from "@/components/QnaComponent";
import * as tf from "@tensorflow/tfjs";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-w-full bg-blue-100 gap-1">
      <h1 className="font-bold text-3xl mb-3">Drill </h1>
      <QnaComponent />
    </div>
  );
}
