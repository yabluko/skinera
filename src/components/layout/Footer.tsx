import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 justify-between">
          <div className="flex gap-44">
            {/* Логотип та опис */}
            <div className="col-span-1">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="bg-brand-600 rounded-full p-1">
                  <Image src="/icon/icon.svg" alt="Skinera Logo" width={32} height={32} />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-600 ">
                  Skinera
                </span>
              </Link>
              <p className="text-gray-600 text-sm max-w-[202px]">
                Професійний догляд за вашою красою та здоровʼям
              </p>
            </div>

            {/* Навігація */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-gray-800 mb-4">Навігація</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/services"
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    Послуги
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    Товари
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex gap-10 justify-between">
            {/* Контакти */}
            <div className="flex flex-col gap-4 w-1/2">
              <h3 className="font-semibold text-gray-800 mb-4">Контакти</h3>
              <ul className="space-y-2">
                <li className="text-gray-600">м.Львів, пр.Червоної калини, 36в</li>
                <li>
                  <a
                    href="tel:+380965180956"
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    +38 096 518 0956
                  </a>
                </li>
                <li className="text-gray-600">Пн-Сб: 10:00 - 20:00</li>
                <li className="text-gray-600">Нд: За попереднім записом</li>
              </ul>
            </div>

            {/* Соціальні мережі */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Соціальні мережі</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/skinera.lviv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group"
                  aria-label="Instagram"
                >
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    <Image src="/icon/icon_instagram.svg" alt="Instagram" width={22} height={22} />
                  </div>
                </a>
                <a
                  href="https://www.facebook.com/EpiLadies/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group"
                  aria-label="Facebook"
                >
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    <Image src="/icon/iconoir_facebook.svg" alt="Facebook" width={22} height={22} />
                  </div>
                </a>
                <a
                  href="https://t.me/skinera_lviv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group"
                  aria-label="Telegram"
                >
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src="/icon/basil_telegram-outline.svg"
                      alt="Telegram"
                      width={22}
                      height={22}
                    />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Skinera. Усі права захищені.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-purple-600 text-sm transition-colors"
              >
                Політика конфіденційності
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 hover:text-purple-600 text-sm transition-colors"
              >
                Умови використання
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
