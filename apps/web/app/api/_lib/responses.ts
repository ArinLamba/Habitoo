import { NextResponse } from "next/server";

export const unauthorized = () => {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
};

export const badRequest = (error: string) => {
  return NextResponse.json({ error }, { status: 400 });
};

export const notFound = (error = "Not found") => {
  return NextResponse.json({ error }, { status: 404 });
};

export const serverError = (error = "Internal server error") => {
  return NextResponse.json({ error }, { status: 500 });
};
