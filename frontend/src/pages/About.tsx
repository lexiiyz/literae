import { BookOpenIcon, GlobeAltIcon, RocketLaunchIcon } from '@heroicons/react/24/solid';

export default function About() {
  return (
    <div className="bg-[#FBF7F0] min-h-screen px-4 py-12 md:px-12 mt-25">
      <div className="max-w-6xl mx-auto space-y-16">

        <section className="text-center" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#2B2C2D]">
            📚 Mengubah Halaman Menjadi Inspirasi
          </h1>
          <p className="text-md md:text-lg text-[#A9A9A9] max-w-3xl mx-auto">
            Literae bukan hanya toko buku, ini adalah komunitas bagi mereka yang percaya pada kekuatan cerita. Kami menghubungkan pembaca dengan dunia baru, satu buku pada satu waktu.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8" data-aos="fade-up">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-bold mb-4 text-[#B58B5C]">Misi Kami</h2>
            <p className="text-md text-[#2B2C2D]">
              Menyediakan akses mudah ke berbagai koleksi buku berkualitas dari seluruh dunia, mendorong kebiasaan membaca, dan membangun komunitas pembaca yang bersemangat.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-bold mb-4 text-[#B58B5C]">Visi Kami</h2>
            <p className="text-md text-[#2B2C2D]">
              Menjadi platform utama bagi pecinta buku di Indonesia, diakui karena pilihan buku yang beragam dan pengalaman membaca yang inovatif.
            </p>
          </div>
        </section>

        <section className="text-center" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-8 text-[#2B2C2D]">Nilai-Nilai Kami</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
              <BookOpenIcon className="h-12 w-12 text-[#00758F] mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-[#2B2C2D]">Aksesibilitas</h3>
              <p className="text-center text-sm text-[#A9A9A9]">
                Kami percaya setiap orang berhak mendapat akses ke pengetahuan dan cerita.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
              <GlobeAltIcon className="h-12 w-12 text-[#00758F] mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-[#2B2C2D]">Keragaman</h3>
              <p className="text-center text-sm text-[#A9A9A9]">
                Kami merangkul beragam genre dan penulis dari berbagai latar belakang budaya.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
              <RocketLaunchIcon className="h-12 w-12 text-[#00758F] mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-[#2B2C2D]">Inovasi</h3>
              <p className="text-center text-sm text-[#A9A9A9]">
                Kami terus berinovasi untuk memberikan pengalaman membaca terbaik.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#B58B5C] text-white p-8 rounded-2xl shadow-xl text-center" data-aos="fade-up">
          <h2 className="text-2xl font-bold mb-2">Ingin tahu lebih lanjut?</h2>
          <p className="text-md mb-4">
            Kami siap membantu! Hubungi tim layanan pelanggan kami.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-[#FBF7F0]">
            <a href="mailto:radityarakha01@gmail.com" className="bg-white text-[#B58B5C] font-semibold py-3 px-6 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300">
              Email: radityarakha01@gmail.com
            </a>
            <a href="https://wa.me/6285775525733" target="_blank" rel="noopener noreferrer" className="bg-white text-[#B58B5C] font-semibold py-3 px-6 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300">
              WhatsApp: +62 857 755 2733
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
