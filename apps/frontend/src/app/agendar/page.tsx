'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Step = 'service' | 'datetime' | 'info' | 'confirm';
type Service = { id: string; name: string; price: number; duration: number; description?: string };
type TimeSlot = { time: string; available: boolean };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api/v1';

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

  const [services, setServices] = useState<Service[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE}/services`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Falha ao carregar serviços');
        const data = await response.json();
        setServices(data);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar serviços');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Fetch available slots when date or service changes
  useEffect(() => {
    if (!selectedDate || !selectedService) {
      setAvailableSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const response = await fetch(`${API_BASE}/availability?serviceId=${selectedService}&date=${selectedDate}`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Falha ao carregar horários');
        const data = await response.json();
        setAvailableSlots(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar horários');
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, selectedService]);

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
    setSubmitting(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const appointmentData = {
        serviceId: selectedService,
        startAt: `${selectedDate}T${selectedTime}:00`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes,
      };

      const response = await fetch(`${API_BASE}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(appointmentData),
        credentials: 'include',
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData?.message || 
          `Erro ao confirmar agendamento (${response.status})`
        );
      }

      setSuccess(true);
      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/minha-agenda';
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao agendar');
    } finally {
      setSubmitting(false);
    }
  };

  const service = services.find((s) => s.id === selectedService);

  if (success) {
    return (
      <main className="booking">
        <nav className="nav">
          <div className="nav__container">
            <Link href="/" className="nav__logo">Mariana Aparicio</Link>
          </div>
        </nav>
        <div className="booking__container">
          <div className="booking__content" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <h2 style={{ marginBottom: '16px' }}>✅ Agendamento Confirmado!</h2>
            <p style={{ marginBottom: '24px', color: 'var(--color-text-secondary)' }}>
              Seu agendamento foi confirmado com sucesso. Redirecionando para "Meus Agendamentos"...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="booking">
        <nav className="nav">
          <div className="nav__container">
            <Link href="/" className="nav__logo">Mariana Aparicio</Link>
          </div>
        </nav>
        <div className="booking__container" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p>Carregando serviços...</p>
        </div>
      </main>
    );
  }

  if (error && step === 'service') {
    return (
      <main className="booking">
        <nav className="nav">
          <div className="nav__container">
            <Link href="/" className="nav__logo">Mariana Aparicio</Link>
          </div>
        </nav>
        <div className="booking__container" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ color: 'var(--color-danger)', marginBottom: '24px' }}>
            ❌ {error}
          </div>
          <Link href="/" className="btn btn--primary">
            Voltar para Home
          </Link>
        </div>
      </main>
    );
  }

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
            {error && <div style={{ color: 'var(--color-danger)', marginBottom: '16px' }}>⚠️ {error}</div>}
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
                  {loadingSlots ? (
                    <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>Carregando horários...</p>
                  ) : availableSlots.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--color-danger)' }}>Nenhum horário disponível neste dia.</p>
                  ) : (
                    <div className="booking__slots-grid">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          className={`booking__slot ${selectedTime === slot.time ? 'booking__slot--selected' : ''} ${!slot.available ? 'booking__slot--disabled' : ''}`}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          disabled={!slot.available}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step: Info */}
        {step === 'info' && (
          <div className="booking__content">
            <h2>Seus Dados</h2>
            {error && <div style={{ color: 'var(--color-danger)', marginBottom: '16px' }}>⚠️ {error}</div>}
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
            {error && <div style={{ color: 'var(--color-danger)', marginBottom: '16px', padding: '12px', backgroundColor: '#fce4ec', borderRadius: 'var(--radius-md)' }}>⚠️ {error}</div>}
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
            <button className="btn btn--outline" onClick={handleBack} disabled={submitting}>
              Voltar
            </button>
          )}
          {step !== 'confirm' ? (
            <button
              className="btn btn--primary"
              onClick={handleNext}
              disabled={
                submitting ||
                (step === 'service' && !selectedService) ||
                (step === 'datetime' && (!selectedDate || !selectedTime)) ||
                (step === 'info' && (!formData.name || !formData.email || !formData.phone))
              }
            >
              Próximo
            </button>
          ) : (
            <button 
              className="btn btn--primary btn--lg" 
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Confirmando...' : 'Confirmar Agendamento'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
