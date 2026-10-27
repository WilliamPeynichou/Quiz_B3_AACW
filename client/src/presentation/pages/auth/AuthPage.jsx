import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../../application/hooks/auth/useAuth'
import { authApi } from '../../../infrastructure/api/auth/authApi'
import './AuthPage.css'

const INITIAL_FORM = { username: '', email: '', password: '', confirmPassword: '' }

const DECORATIVE_STARS = Array.from({ length: 27 }, (_, index) => ({
  left: `${(index * 47 + 13) % 97}%`,
  top: `${(index * 29 + 7) % 93}%`,
  delay: `${(index % 9) * -0.45}s`,
  size: `${index % 5 === 0 ? 3 : 2}px`,
}))

function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const contents = {
    arrow: <><path d="M4.5 12h15" /><path d="m13 5.5 6.5 6.5-6.5 6.5" /></>,
    eye: <><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" /><circle cx="12" cy="12" r="2.7" /></>,
    eyeOff: <><path d="M3 3l18 18" /><path d="M10.6 5.6A10.4 10.4 0 0 1 12 5.5c6.4 0 10 6.5 10 6.5a18 18 0 0 1-3.2 3.9" /><path d="M6.7 6.7C3.7 8.5 2 12 2 12s3.6 6.5 10 6.5a10.5 10.5 0 0 0 4.3-.9" /><path d="M9.8 9.8a3.1 3.1 0 0 0 4.4 4.4" /></>,
    mail: <><rect x="2.8" y="5" width="18.4" height="14" rx="3" /><path d="m3.8 7 8.2 6 8.2-6" /></>,
    person: <><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c0-4.1 3-6.1 7.5-6.1s7.5 2 7.5 6.1" /></>,
    lock: <><rect x="4.5" y="10" width="15" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M12 14.5v2.5" /></>,
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    star: <><path d="m12 2 2.3 7.7L22 12l-7.7 2.3L12 22l-2.3-7.7L2 12l7.7-2.3L12 2Z" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
    shield: <><path d="m12 2 8 3v6c0 5.5-3.4 8.6-8 11-4.6-2.4-8-5.5-8-11V5l8-3Z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
    logout: <><path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" /><path d="M14 8l4 4-4 4M9 12h9" /></>,
  }
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {contents[name]}
    </svg>
  )
}

function Brand({ small = false }) {
  return (
    <Link to="/" className={`auth-brand ${small ? 'auth-brand--small' : ''}`} aria-label="Quiz B3, accueil">
      <span className="auth-brand-emblem" aria-hidden="true"><span>Q</span><i /></span>
      <span className="auth-brand-word">quiz<span>b3</span><span className="auth-brand-period">.</span></span>
    </Link>
  )
}

function Story() {
  const tilt = (event) => {
    if (event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--rx', `${((event.clientY - rect.top) / rect.height - 0.5) * -7}deg`)
    event.currentTarget.style.setProperty('--ry', `${((event.clientX - rect.left) / rect.width - 0.5) * 9}deg`)
  }
  const resetTilt = (event) => {
    event.currentTarget.style.setProperty('--rx', '0deg')
    event.currentTarget.style.setProperty('--ry', '0deg')
  }

  return (
    <section className="auth-story" aria-label="L'univers Quiz B3">
      <div className="auth-story-copy">
        <span className="auth-overline"><span className="auth-pulse-dot" /> LE SAVOIR EST TON TERRAIN DE JEU</span>
        <h1 className="auth-story-title">Pense vite.<br /><span>Vise juste.</span><br />Brille fort<span className="auth-title-dot">.</span></h1>
        <p className="auth-story-description">Chaque question est une nouvelle chance de te surprendre. Prêt à montrer ce que tu sais vraiment ?</p>
      </div>

      <div className="auth-art" onPointerMove={tilt} onPointerLeave={resetTilt} aria-hidden="true">
        <div className="auth-art-inner">
          <div className="auth-orbit auth-orbit-one" />
          <div className="auth-orbit auth-orbit-two" />
          <div className="auth-orbit auth-orbit-three" />
          <span className="auth-orbit-flash flash-one">✦</span>
          <span className="auth-orbit-flash flash-two">✳</span>
          <span className="auth-orbit-flash flash-three">✦</span>
          <div className="auth-orb-halo" />
          <div className="auth-orb">
            <span className="auth-orb-core">Q</span>
            <div className="auth-orb-light" />
          </div>
          <div className="auth-float auth-float-question">
            <span className="auth-float-label">QUESTION <b>04/10</b></span>
            <span className="auth-float-heading">Prêt pour la suite ?</span>
            <div className="auth-float-progress"><span /></div>
          </div>
          <div className="auth-float auth-float-score">
            <div className="auth-score-mark">✧</div>
            <div><span className="auth-float-label">SÉRIE EN COURS</span><strong>+120 <small>XP</small></strong></div>
          </div>
          <span className="auth-orbit-tag tag-one">LOGIQUE</span>
          <span className="auth-orbit-tag tag-two">CULTURE G.</span>
        </div>
      </div>

      <div className="auth-story-footer">
        <span className="auth-story-line" />
        <span>APPRENDS <i>✦</i> JOUE <i>✦</i> DÉPASSE-TOI</span>
      </div>
    </section>
  )
}

function AuthField({ icon, label, name, type = 'text', value, onChange, placeholder, autoComplete, error, disabled, minLength, maxLength, extra, onBlur }) {
  return (
    <div className={`auth-input-group ${error ? 'has-error' : ''}`}>
      <label htmlFor={`auth-${name}`}>{label}</label>
      <div className="auth-input-wrap">
        <span className="auth-input-icon"><Icon name={icon} size={19} /></span>
        <input
          id={`auth-${name}`}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `auth-${name}-error` : undefined}
          disabled={disabled}
          minLength={minLength}
          maxLength={maxLength}
          required
          spellCheck={false}
        />
        {extra}
      </div>
      {error && <span id={`auth-${name}-error`} className="auth-field-error" role="alert">{error}</span>}
    </div>
  )
}

function passwordQuality(password) {
  if (!password) return { level: 0, text: '' }
  let level = 0
  if (password.length >= 8) level++
  if (password.length >= 12) level++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) level++
  if (/\d/.test(password) && /[^a-zA-Z0-9]/.test(password)) level++
  return { level: Math.max(1, level), text: ['','À renforcer', 'Correct', 'Bon', 'Très bon'][Math.max(1, level)] }
}

function validate(mode, form) {
  const problems = {}
  const email = form.email.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problems.email = 'Saisis une adresse email valide.'
  if (!form.password) problems.password = 'Le mot de passe est obligatoire.'
  if (mode === 'register') {
    if (!/^[\p{L}\p{N}_-]{3,30}$/u.test(form.username.trim())) {
      problems.username = '3 à 30 caractères : lettres, chiffres, _ ou -.'
    }
    const bytes = new TextEncoder().encode(form.password).length
    if (form.password.length < 8 || bytes > 72) {
      problems.password = 'Entre 8 caractères et 72 octets maximum.'
    }
    if (form.password !== form.confirmPassword) {
      problems.confirmPassword = 'Les mots de passe ne correspondent pas.'
    }
  }
  return problems
}

function WelcomeCard({ user, logout }) {
  return (
    <div className="auth-welcome" key="welcome">
      <div className="auth-welcome-icon"><Icon name="check" size={43} strokeWidth={2.5} /></div>
      <div className="auth-card-eyebrow"><span className="auth-status-dot" /> SESSION ACTIVE</div>
      <h2 className="auth-card-title">Te revoilà,<br /><em>{user.username}.</em></h2>
      <p className="auth-card-description">Ton espace est prêt. La prochaine bonne réponse n'attend que toi.</p>
      <Link className="auth-primary auth-primary-link" to="/">Continuer l'aventure <Icon name="arrow" size={19} /></Link>
      <button className="auth-logout" type="button" onClick={logout}><Icon name="logout" size={18}/> Se déconnecter</button>
    </div>
  )
}

export function AuthPage() {
  const { user, loading: checkingSession, login, logout } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(INITIAL_FORM)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const isRegister = mode === 'register'
  const strength = useMemo(() => passwordQuality(form.password), [form.password])

  const setAuthMode = (next) => {
    if (pending || next === mode) return
    setMode(next)
    setForm((old) => ({ username: '', email: old.email, password: '', confirmPassword: '' }))
    setShowPassword(false)
    setShowConfirm(false)
    setError('')
    setFieldErrors({})
  }

  const changeField = (event) => {
    const { name, value } = event.target
    setForm((old) => ({ ...old, [name]: value }))
    setFieldErrors((old) => ({ ...old, [name]: undefined }))
    setError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    if (pending || checkingSession) return
    const problems = validate(mode, form)
    if (Object.keys(problems).length) {
      setFieldErrors(problems)
      return
    }
    setPending(true)
    setError('')
    setFieldErrors({})
    try {
      const credentials = isRegister
        ? { username: form.username.trim(), email: form.email.trim(), password: form.password }
        : { email: form.email.trim(), password: form.password }
      const result = isRegister
        ? await authApi.register(credentials)
        : await authApi.login(credentials)
      login(result)
    } catch (err) {
      setError(err.message || 'Impossible de continuer pour le moment.')
      setFieldErrors(err.details || {})
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="auth-page" data-mode={mode}>
      <div className="auth-intro-curtain" aria-hidden="true"><span className="auth-intro-brand">quiz<span>b3</span><b>.</b></span><span className="auth-intro-track"><i /></span></div>
      <div className="auth-backdrop" aria-hidden="true">
        <div className="auth-grid" /><div className="auth-light auth-light-a" /><div className="auth-light auth-light-b" />
        {DECORATIVE_STARS.map((star, index) => <span key={index} className="auth-star" style={{ '--star-x': star.left, '--star-y': star.top, '--star-delay': star.delay, '--star-size': star.size }} />)}
      </div>
      <div className="auth-container">
        <header className="auth-topbar">
          <Brand />
          <div className="auth-topbar-right"><span className="auth-top-status"><span /> LE QUIZ EST OUVERT</span><Link className="auth-top-return" to="/">Découvrir le quiz <Icon name="arrow" size={17}/></Link></div>
        </header>
        <div className="auth-main-grid">
          <Story />
          <section className="auth-form-area" aria-label={user ? 'Mon espace' : 'Authentification'}>
            <div className="auth-form-card">
              <div className="auth-card-topline"><span>TON ESPACE <strong>/</strong> QUIZ B3</span><span className="auth-card-star"><Icon name="star" size={21} /></span></div>
              {checkingSession ? (
                <div className="auth-session-check" role="status"><div className="auth-spinner auth-spinner-large" /><h2>Un instant...</h2><p>Nous vérifions ta session.</p></div>
              ) : user ? (
                <WelcomeCard user={user} logout={logout} />
              ) : (
                <div className="auth-card-form">
                  <div className="auth-card-heading" aria-live="polite">
                    <div className="auth-card-eyebrow"><span className="auth-status-dot" /> {isRegister ? 'NOUVEAU JOUEUR' : 'HEUREUX DE TE REVOIR'}</div>
                    <h2 className="auth-card-title">{isRegister ? <>Prêt à <em>jouer ?</em></> : <>Entre dans <em>le jeu.</em></>}</h2>
                    <p className="auth-card-description">{isRegister ? 'Crée ton compte et commence à gravir les niveaux.' : 'Connecte-toi pour reprendre là où tu t’es arrêté.'}</p>
                  </div>
                  <div className="auth-tabs" role="group" aria-label="Choisir un formulaire">
                    <span className="auth-tab-indicator" style={{ transform: isRegister ? 'translateX(100%)' : 'translateX(0)' }} aria-hidden="true" />
                    <button type="button" className={!isRegister ? 'is-active' : ''} aria-pressed={!isRegister} disabled={pending} onClick={() => setAuthMode('login')}>Connexion</button>
                    <button type="button" className={isRegister ? 'is-active' : ''} aria-pressed={isRegister} disabled={pending} onClick={() => setAuthMode('register')}>Inscription</button>
                  </div>
                  <form key={mode} className="auth-form" onSubmit={submit} noValidate>
                    {isRegister && (
                      <AuthField icon="person" name="username" label="Nom de joueur" placeholder="Ton pseudo" autoComplete="username" value={form.username} onChange={changeField} error={fieldErrors.username} disabled={pending} minLength={3} maxLength={30} />
                    )}
                    <AuthField icon="mail" name="email" type="email" label="Adresse email" placeholder="toi@exemple.fr" autoComplete="email" value={form.email} onChange={changeField} error={fieldErrors.email} disabled={pending} />
                    <AuthField icon="lock" name="password" type={showPassword ? 'text' : 'password'} label="Mot de passe" placeholder={isRegister ? '8 caractères minimum' : 'Ton mot de passe'} autoComplete={isRegister ? 'new-password' : 'current-password'} value={form.password} onChange={changeField} error={fieldErrors.password} disabled={pending}
                      extra={<button className="auth-visibility" type="button" disabled={pending} onClick={() => setShowPassword((state) => !state)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} aria-pressed={showPassword}><Icon name={showPassword ? 'eyeOff' : 'eye'} size={19}/></button>}
                    />
                    {isRegister && (
                      <>
                        <div className="auth-strength" aria-live="polite"><div className="auth-strength-bars">{[1,2,3,4].map((n) => <span key={n} className={strength.level >= n ? 'lit' : ''} data-level={strength.level} />)}</div><span>{strength.text || 'Sécurise ton compte'}</span></div>
                        <AuthField icon="shield" name="confirmPassword" type={showConfirm ? 'text' : 'password'} label="Confirmer le mot de passe" placeholder="Répète ton mot de passe" autoComplete="new-password" value={form.confirmPassword} onChange={changeField} error={fieldErrors.confirmPassword} disabled={pending}
                          extra={<button className="auth-visibility" type="button" disabled={pending} onClick={() => setShowConfirm((state) => !state)} aria-label={showConfirm ? 'Masquer la confirmation' : 'Afficher la confirmation'} aria-pressed={showConfirm}><Icon name={showConfirm ? 'eyeOff' : 'eye'} size={19}/></button>}
                        />
                      </>
                    )}
                    {!isRegister && <div className="auth-form-hint"><span><Icon name="shield" size={15}/> Connexion sécurisée</span><span>Continue ta progression</span></div>}
                    {error && <div className="auth-form-error" role="alert"><span>!</span><p>{error}</p></div>}
                    <button className="auth-primary" type="submit" disabled={pending}>
                      <span>{pending ? 'Un instant...' : isRegister ? 'Créer mon compte' : 'Entrer dans l’arène'}</span>
                      {pending ? <span className="auth-spinner" /> : <Icon name="arrow" size={20} />}
                    </button>
                    <div className="auth-form-switch">{isRegister ? 'Déjà dans l’aventure ?' : 'Nouveau dans le jeu ?'} <button type="button" disabled={pending} onClick={() => setAuthMode(isRegister ? 'login' : 'register')}>{isRegister ? 'Se connecter' : 'Créer un compte'} <span aria-hidden="true">↗</span></button></div>
                  </form>
                </div>
              )}
              <div className="auth-card-bottom"><Icon name="lock" size={14}/> Tes données restent les tiennes.</div>
            </div>
            <p className="auth-outside-caption"><span>✧</span> Le premier pas vers la prochaine victoire.</p>
          </section>
        </div>
        <footer className="auth-footer"><span>© QUIZ B3 · 2026</span><span>CONÇU POUR LES ESPRITS CURIEUX <b>✳</b></span><Link to="/">RETOUR AU JEU ↑</Link></footer>
      </div>
    </main>
  )
}
