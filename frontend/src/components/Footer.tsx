import { EnvelopeIcon, PhoneIcon, ClockIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="bg-[#2B2C2D] text-[#FBF7F0] py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-extrabold text-2xl text-[#FBF7F0] mb-4">Literae</h3>
          <p className="text-sm text-[#A9A9A9] leading-relaxed">
            Temukan petualangan baru di setiap halaman. Literae adalah toko buku online tempat Anda menemukan cerita terbaik.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 text-[#FBF7F0]">Informasi Toko</h3>
          <ul className="space-y-3 text-sm text-[#A9A9A9]">
            <li className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-[#B58B5C]" />
              <span>Buka setiap hari: 09:00 - 21:00</span>
            </li>
            <li className="flex items-center gap-2">
              <GlobeAltIcon className="h-5 w-5 text-[#B58B5C]" />
              <span>Jl. Teknik Geodesi Blok R no 10</span>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold text-lg mb-4 text-[#FBF7F0]">Kontak Kami</h3>
          <ul className="space-y-3 text-sm text-[#A9A9A9]">
            <li className="flex items-center gap-2">
              <EnvelopeIcon className="h-5 w-5 text-[#B58B5C]" />
              <span>radityarakha01@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="h-5 w-5 text-[#B58B5C]" />
              <span>+62 85775525733</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 text-[#FBF7F0]">Ikuti Kami</h3>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-[#B58B5C] transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.023 16.907c-2.109-.236-4.103-.687-5.885-1.554-1.782-.868-3.149-2.091-4.041-3.567.892-1.476 2.259-2.7 4.041-3.567 1.782-.868 3.776-1.318 5.885-1.554 2.109-.236 4.218-.088 6.136.438-.172-.047-.35-.084-.53-.119-.89-.176-1.784-.265-2.673-.265-3.031 0-5.698 1.455-7.399 3.655-1.701 2.2-2.146 5.093-1.127 7.747.078-.052.158-.103.24-.153z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#B58B5C] transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm2.023 16.907c-2.109-.236-4.103-.687-5.885-1.554-1.782-.868-3.149-2.091-4.041-3.567.892-1.476 2.259-2.7 4.041-3.567 1.782-.868 3.776-1.318 5.885-1.554 2.109-.236 4.218-.088 6.136.438-.172-.047-.35-.084-.53-.119-.89-.176-1.784-.265-2.673-.265-3.031 0-5.698 1.455-7.399 3.655-1.701 2.2-2.146 5.093-1.127 7.747.078-.052.158-.103.24-.153z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#B58B5C] transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm2.023 16.907c-2.109-.236-4.103-.687-5.885-1.554-1.782-.868-3.149-2.091-4.041-3.567.892-1.476 2.259-2.7 4.041-3.567 1.782-.868 3.776-1.318 5.885-1.554 2.109-.236 4.218-.088 6.136.438-.172-.047-.35-.084-.53-.119-.89-.176-1.784-.265-2.673-.265-3.031 0-5.698 1.455-7.399 3.655-1.701 2.2-2.146 5.093-1.127 7.747.078-.052.158-.103.24-.153z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-[#A9A9A9]">
        <p>&copy; 2025 Literae. All rights reserved.</p>
      </div>
    </footer>
  );
}
