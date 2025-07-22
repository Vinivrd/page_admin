import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import '../styles/login.scss';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Monitorar o tamanho da janela para ajustes responsivos
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simular chamada de API com um timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulação de sucesso
      alert('Login realizado com sucesso!');
      
      // Aqui você pode redirecionar o usuário para a página principal
      // navigate('/dashboard');
    } catch (error) {
      // Tratamento de erro
      alert('Erro ao fazer login. Tente novamente.');
      console.error('Erro de login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Card Principal */}
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-header__icon">
              <User />
            </div>
            <h1 className="login-header__title">Bem-vindo</h1>
            <p className="login-header__subtitle">Faça login em sua conta admin</p>
          </div>

          {/* Formulário */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-form__group">
              <label htmlFor="email">Email</label>
              <div className="login-form__input-wrapper">
                <Mail className="icon-left" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`login-form__input ${errors.email ? 'login-form__input--error' : ''}`}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  autoFocus={windowWidth > 768}
                />
              </div>
              {errors.email && (
                <p className="login-form__error">{errors.email}</p>
              )}
            </div>

            <div className="login-form__group">
              <label htmlFor="password">Senha</label>
              <div className="login-form__input-wrapper">
                <Lock className="icon-left" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`login-form__input ${errors.password ? 'login-form__input--error' : ''}`}
                  placeholder="Sua senha"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <p className="login-form__error">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="login-form__button"
            >
              {isLoading ? (
                <>
                  <span className="login-form__button__spinner"></span>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 