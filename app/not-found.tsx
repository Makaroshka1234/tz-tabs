import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
      <h2 className="text-2xl font-semibold mb-2">Таб без лінки</h2>
      <p className="text-gray-600 mb-6">Ця сторінка ще не має контенту або лінки.</p>
      <Link href="/" className="text-blue-600 hover:underline font-medium">
        Повернутися на головну
      </Link>
    </div>
  );
}
