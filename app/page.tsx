"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, Instagram, Wrench, Droplets, Hammer, Clock, CheckCircle, Star } from "lucide-react"

export default function PlumbingWebsite() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name ist erforderlich"
    if (!formData.email.trim()) newErrors.email = "E-Mail ist erforderlich"
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Ungültige E-Mail-Adresse"
    if (!formData.phone.trim()) newErrors.phone = "Telefonnummer ist erforderlich"
    if (!formData.service) newErrors.service = "Bitte wählen Sie einen Service"
    if (!formData.date) newErrors.date = "Datum ist erforderlich"
    if (!formData.time) newErrors.time = "Zeit ist erforderlich"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      const subject = `Terminanfrage: ${formData.service}`
      const body = `
Name: ${formData.name}
E-Mail: ${formData.email}
Telefon: ${formData.phone}
Service: ${formData.service}
Datum: ${formData.date}
Zeit: ${formData.time}
Zusätzliche Notizen: ${formData.notes}
      `
      window.location.href = `mailto:info@klempner-deutschland.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header & Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-[#004c99]" />
              <h1 className="text-2xl font-bold text-[#004c99]">ProKlempner Deutschland</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-gray-700 hover:text-[#004c99] transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-gray-700 hover:text-[#004c99] transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("gallery")}
                className="text-gray-700 hover:text-[#004c99] transition-colors"
              >
                Galerie
              </button>
              <button
                onClick={() => scrollToSection("booking")}
                className="text-gray-700 hover:text-[#004c99] transition-colors"
              >
                Termin buchen
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-700 hover:text-[#004c99] transition-colors"
              >
                Kontakt
              </button>
            </nav>
            <Button onClick={() => scrollToSection("booking")} className="bg-[#0073e6] hover:bg-[#004c99]">
              Jetzt buchen
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[#004c99] mb-4">Schnellkontakt</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#00b3b3]" />
                <span className="text-sm">+49 123 456 7890</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#00b3b3]" />
                <span className="text-sm">info@proklempner.de</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-[#00b3b3]" />
                <span className="text-sm">24/7 Notdienst</span>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-semibold text-[#004c99] mb-3">Warum uns wählen?</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-[#00b3b3]" />
                  <span>15+ Jahre Erfahrung</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-[#00b3b3]" />
                  <span>Zertifizierte Handwerker</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-[#00b3b3]" />
                  <span>Faire Preise</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-[#00b3b3]" />
                  <span>Garantie auf alle Arbeiten</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <section id="hero" className="bg-gradient-to-r from-[#004c99] to-[#0073e6] text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-4xl md:text-6xl font-bold mb-6">
                  Professionelle Klempnerarbeiten in ganz Deutschland
                </h2>
                <p className="text-xl md:text-2xl mb-8 text-blue-100">
                  Schnell, zuverlässig und zu fairen Preisen - Ihr Experte für alle Sanitärarbeiten
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => scrollToSection("booking")}
                    size="lg"
                    className="bg-[#00b3b3] hover:bg-[#008080] text-white px-8 py-3 text-lg"
                  >
                    Jetzt Termin buchen
                  </Button>
                  <Button
                    onClick={() => scrollToSection("services")}
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-[#004c99] px-8 py-3 text-lg"
                  >
                    Unsere Services
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section id="services" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[#004c99] mb-4">Unsere Dienstleistungen</h2>
                <p className="text-xl text-gray-600">
                  Von der Reparatur bis zur kompletten Badsanierung - wir sind Ihr zuverlässiger Partner
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Droplets className="h-12 w-12 text-[#00b3b3] mb-4" />
                    <CardTitle className="text-[#004c99]">Rohrleitungsinstallation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Professionelle Installation und Reparatur von Wasserleitungen, Abwasserleitungen und
                      Heizungsrohren.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Wrench className="h-12 w-12 text-[#00b3b3] mb-4" />
                    <CardTitle className="text-[#004c99]">Leckage-Reparatur</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Schnelle Ortung und Behebung von Wasserlecks. 24/7 Notdienst für dringende Reparaturen.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Hammer className="h-12 w-12 text-[#00b3b3] mb-4" />
                    <CardTitle className="text-[#004c99]">Badsanierung</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Komplette Badezimmerrenovierung von der Planung bis zur Fertigstellung. Modern und funktional.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Clock className="h-12 w-12 text-[#00b3b3] mb-4" />
                    <CardTitle className="text-[#004c99]">24/7 Notdienst</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Rund um die Uhr verfügbar für Notfälle. Schnelle Hilfe bei Rohrbrüchen und Wasserschäden.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Droplets className="h-12 w-12 text-[#00b3b3] mb-4" />
                    <CardTitle className="text-[#004c99]">Heizungsservice</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Wartung, Reparatur und Installation von Heizungsanlagen. Effizient und energiesparend.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CheckCircle className="h-12 w-12 text-[#00b3b3] mb-4" />
                    <CardTitle className="text-[#004c99]">Wartung & Inspektion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Regelmäßige Wartung Ihrer Sanitäranlagen zur Vermeidung kostspieliger Reparaturen.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Gallery Section */}
          <section id="gallery" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[#004c99] mb-4">Unsere Arbeiten</h2>
                <p className="text-xl text-gray-600">
                  Einblicke in unsere hochwertigen Klempnerarbeiten und zufriedene Kunden
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <img
                    src="/modern-blue-bathroom.png"
                    alt="Moderne Badsanierung"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <p className="text-white p-4 font-semibold">Moderne Badsanierung</p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <img
                    src="/plumber-installing-pipes.png"
                    alt="Rohrleitungsinstallation"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <p className="text-white p-4 font-semibold">Rohrleitungsinstallation</p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <img
                    src="/placeholder-a3rs7.png"
                    alt="Professionelle Werkzeuge"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <p className="text-white p-4 font-semibold">Professionelle Werkzeuge</p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <img src="/plumber-fixing-leak.png" alt="Leckage-Reparatur" className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <p className="text-white p-4 font-semibold">Leckage-Reparatur</p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <img
                    src="/placeholder-9lo5n.png"
                    alt="Heizungsinstallation"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <p className="text-white p-4 font-semibold">Heizungsinstallation</p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <img src="/happy-customer-plumber-handshake.png" alt="Zufriedene Kunden" className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <p className="text-white p-4 font-semibold">Zufriedene Kunden</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Booking Form Section */}
          <section id="booking" className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[#004c99] mb-4">Termin buchen</h2>
                <p className="text-xl text-gray-600">
                  Vereinbaren Sie einen Termin für Ihre Klempnerarbeiten - schnell und unkompliziert
                </p>
              </div>

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#004c99]">Terminanfrage</CardTitle>
                  <CardDescription>
                    Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <Label htmlFor="email">E-Mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <Label htmlFor="phone">Telefon *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>

                      <div>
                        <Label htmlFor="service">Service *</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, service: value })}>
                          <SelectTrigger className={errors.service ? "border-red-500" : ""}>
                            <SelectValue placeholder="Service auswählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rohrleitungsinstallation">Rohrleitungsinstallation</SelectItem>
                            <SelectItem value="leckage-reparatur">Leckage-Reparatur</SelectItem>
                            <SelectItem value="badsanierung">Badsanierung</SelectItem>
                            <SelectItem value="notdienst">24/7 Notdienst</SelectItem>
                            <SelectItem value="heizungsservice">Heizungsservice</SelectItem>
                            <SelectItem value="wartung">Wartung & Inspektion</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
                      </div>

                      <div>
                        <Label htmlFor="date">Wunschdatum *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className={errors.date ? "border-red-500" : ""}
                        />
                        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                      </div>

                      <div>
                        <Label htmlFor="time">Wunschzeit *</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, time: value })}>
                          <SelectTrigger className={errors.time ? "border-red-500" : ""}>
                            <SelectValue placeholder="Zeit auswählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="08:00-10:00">08:00 - 10:00</SelectItem>
                            <SelectItem value="10:00-12:00">10:00 - 12:00</SelectItem>
                            <SelectItem value="12:00-14:00">12:00 - 14:00</SelectItem>
                            <SelectItem value="14:00-16:00">14:00 - 16:00</SelectItem>
                            <SelectItem value="16:00-18:00">16:00 - 18:00</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Zusätzliche Notizen</Label>
                      <Textarea
                        id="notes"
                        placeholder="Beschreiben Sie Ihr Problem oder Ihre Anforderungen..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-[#0073e6] hover:bg-[#004c99] text-white py-3 text-lg">
                      Terminanfrage senden
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-20 bg-[#004c99] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Kontakt</h2>
                <p className="text-xl text-blue-100">Erreichen Sie uns jederzeit - wir sind für Sie da</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="bg-white/10 rounded-lg p-8 backdrop-blur-sm">
                  <Phone className="h-12 w-12 text-[#00b3b3] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Telefon</h3>
                  <p className="text-blue-100 mb-2">24/7 Erreichbar</p>
                  <a
                    href="tel:+491234567890"
                    className="text-[#00b3b3] hover:text-white transition-colors text-lg font-semibold"
                  >
                    +49 123 456 7890
                  </a>
                </div>

                <div className="bg-white/10 rounded-lg p-8 backdrop-blur-sm">
                  <Mail className="h-12 w-12 text-[#00b3b3] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">E-Mail</h3>
                  <p className="text-blue-100 mb-2">Schnelle Antwort garantiert</p>
                  <a
                    href="mailto:info@proklempner.de"
                    className="text-[#00b3b3] hover:text-white transition-colors text-lg font-semibold"
                  >
                    info@proklempner.de
                  </a>
                </div>

                <div className="bg-white/10 rounded-lg p-8 backdrop-blur-sm">
                  <Instagram className="h-12 w-12 text-[#00b3b3] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Instagram</h3>
                  <p className="text-blue-100 mb-2">Folgen Sie uns</p>
                  <a
                    href="https://instagram.com/proklempner"
                    className="text-[#00b3b3] hover:text-white transition-colors text-lg font-semibold"
                  >
                    @proklempner
                  </a>
                </div>
              </div>

              <div className="mt-16 text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
                <p className="text-blue-100 text-lg">
                  "Ausgezeichneter Service und faire Preise. Sehr zu empfehlen!" - Über 500 zufriedene Kunden
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Wrench className="h-6 w-6 text-[#00b3b3]" />
                <h3 className="text-lg font-semibold">ProKlempner Deutschland</h3>
              </div>
              <p className="text-gray-400">
                Ihr zuverlässiger Partner für alle Sanitär- und Klempnerarbeiten in ganz Deutschland.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Rohrleitungsinstallation</li>
                <li>Leckage-Reparatur</li>
                <li>Badsanierung</li>
                <li>24/7 Notdienst</li>
                <li>Heizungsservice</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+49 123 456 7890</li>
                <li>info@proklempner.de</li>
                <li>24/7 Verfügbar</li>
                <li>Deutschlandweit</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Folgen Sie uns</h4>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com/proklempner"
                  className="text-gray-400 hover:text-[#00b3b3] transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ProKlempner Deutschland. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
