'use client';

import { useState } from 'react';
import Link from 'next/link';

type Step = 'service' | 'datetime' | 'info' | 'confirm';

export default function AgendarPage() {
  const [step, setStep] = useState<Step>('service');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const services = [
    { id: '1', name: 'Maquiagem Social', price: 150, duration: 60 },
    { id: '2', name: 'Maquiagem para Noivas', price: 350, duration: 90 },
    { id: '3', name: 'Maquiagem para Formatura', price: 180, duration: 60 },
    { id: '4', name: 'Maquiagem Express', price: 90, duration: 30 },
    { id: '5', name: 'Maquiagem + Cilios', price: 200, duration: 75 },
  ];

  const availableSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00',
  ];

  const handleNext = () => {
    if (step === 'service' && selectedService) setStep('datetime');
    else if (step === 'datetime' && selectedDate && selectedTime) setStep('info');
    else if (step === 'info' && formData.name && formData.email && formData.phone) setStep('confirm');
  };

  const handleBack = () => {
    if (step === 'datetime') setStep('service');
    else if (step === 'info') setStep('datetime');
    else if (step === 'confirm') setStep('info');
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService,
          startAt: `${selectedDate}T${selectedTime}:00`,
          ...formData,
        }),
      });

      if (!response.ok) throw new Error('Falha ao agendar');
      alert('Agendamento confirmado!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao agendar');
    }
  };

  const service = services.find((s) => s.id === selectedService);

  return (
    <main className="booking">
      <nav className="nav">
        <div className="nav__container">
          <Link href="/" className="nav__logo">Mariana Aparicio</Link>
        </div>
      </nav>

      <div className="booking__container">
        {/* Progress */}
        <div className="booking__progress">
          {['service', 'datetime', 'info', 'confirm'].map((s, i) => (
            <div
              key={s}
              className={`booking__step ${step === s ? 'booking__step--active' : ''} ${
                ['service', 'datetime', 'info', 'confirm'].indexOf(step) > i
                  ? 'booking__step--completed'
                  : ''
              }`}
            >
              <span className="booking__step-number">{i + 1}</span>
              <span className="booking__step-label">
                {s === 'service' ? 'Serviço' : s === 'datetime' ? 'Data/Hora' : s === 'info' ? 'Dados' : 'Confirmar'}
              </span>
            </div>
          ))}
        </div>

        {/* Step: Service */}
        {step === 'service' && (
          <div className="booking__content">
            <h2>Escolha o Serviço</h2>
            <div className="booking__services">
              {services.map((s) => (
                <button
                  key={s.id}
                  className={`booking__service-card ${selectedService === s.id ? 'booking__service-card--selected' : ''}`}
                  onClick={() => setSelectedService(s.id)}
                >
                  <h3>{s.name}</h3>
                  <p>{s.duration} minutos</p>
                  <span>R$ {s.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Date/Time */}
        {step === 'datetime' && (
          <div className="booking__content">
            <h2>Escolha a Data e Horário</h2>
            <div className="booking__datetime">
              <div className="booking__date-picker">
                <label className="form-label">Data</label>
                <input
                  type="date"
                  className="form-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              {selectedDate && (
                <div className="booking__time-slots">
                  <label className="form-label">Horário</label>
                  <div className="booking__slots-grid">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        className={`booking__slot ${selectedTime === slot ? 'booking__slot--selected' : ''}`}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step: Info */}
        {step === 'info' && (
          <div className="booking__content">
            <h2>Seus Dados</h2>
            <form className="booking__form">
              <div className="form-group">
                <label className="form-label">Nome completo</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Observações (opcional)</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Alguma informação adicional..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </form>
          </div>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && service && (
          <div className="booking__content">
            <h2>Confira seu Agendamento</h2>
            <div className="booking__summary card">
              <div className="booking__summary-item">
                <span>Serviço</span>
                <strong>{service.name}</strong>
              </div>
              <div className="booking__summary-item">
                <span>Data</span>
                <strong>{new Date(selectedDate).toLocaleDateString('pt-BR')}</strong>
              </div>
              <div className="booking__summary-item">
                <span>Horário</span>
                <strong>{selectedTime}</strong>
              </div>
              <div className="booking__summary-item">
                <span>Duração</span>
                <strong>{service.duration} minutos</strong>
              </div>
              <div className="booking__summary-item">
                <span>Valor</span>
                <strong>R$ {service.price.toFixed(2)}</strong>
              </div>
              <div className="booking__summary-item">
                <span>Cliente</span>
                <strong>{formData.name}</strong>
              </div>
            </div>
            <p className="booking__policy">
              Cancelamentos devem ser realizados com pelo menos 24 horas de antecedência.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="booking__actions">
          {step !== 'service' && (
            <button className="btn btn--outline" onClick={handleBack}>
              Voltar
            </button>
          )}
          {step !== 'confirm' ? (
            <button
              className="btn btn--primary"
              onClick={handleNext}
              disabled={
                (step === 'service' && !selectedService) ||
                (step === 'datetime' && (!selectedDate || !selectedTime)) ||
                (step === 'info' && (!formData.name || !formData.email || !formData.phone))
              }
            >
              Proximo
            </button>
          ) : (
            <button className="btn btn--primary btn--lg" onClick={handleSubmit}>
              Confirmar Agendamento
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
