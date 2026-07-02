import Container from "../shared/Container";
import Button from "../shared/Button";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { Phone } from "lucide-react";

export default function HeroSection() {
  const message = encodeURIComponent(
    "Hi AiroFox, I need help with home services.",
  );
  return (
    <section className="py-24 bg-gradient-to-b from-white to-orange-50">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-brand-navy leading-tight">
              Premium Home Services at Your Fingertips
            </h1>

            <p className="mt-6 text-lg text-brand-slate">
              AC repair, cleaning, plumbing and more.
            </p>

            <div className="flex gap-4 mt-8">
              <a href="tel:+919326065836">
                <Button className="gap-2">
                  <Phone size={18} />
                  Book Now
                </Button>
              </a>

              <a
                href={`https://wa.me/919326065836?text=${message}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="whatsapp" className="gap-2">
                  <FaWhatsapp size={18} />
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>

          <div className="relative w-full min-h-[420px] rounded-3xl overflow-hidden">
            <Image
              src="/NewHero.jpeg"
              alt="Hero showcasing home services"
              fill
              sizes="100vw"
              className="object-contain object-center"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
