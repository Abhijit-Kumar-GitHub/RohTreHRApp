import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Attendance from './components/Attendance'
import Leaves from './components/Leaves'
import Payroll from './components/Payroll'

function App() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentView, setCurrentView] = useState('dashboard')

    useEffect(() => {
        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setCurrentView('dashboard')
    }

    if (loading) {
        return (
            <div className="container flex-between" style={{ minHeight: '100vh', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Loading...</h2>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Login onLogin={setUser} />
    }

    return (
        <div>
            {/* Navigation */}
            <nav style={{
                background: 'var(--bg-card)',
                borderBottom: '1px solid var(--border)',
                padding: '1rem'
            }}>
                <div className="container flex-between">
                    <h2>RohTre HR</h2>
                    <div className="flex">
                        <button className="btn btn-primary" onClick={() => setCurrentView('dashboard')}>
                            Dashboard
                        </button>
                        <button className="btn btn-primary" onClick={() => setCurrentView('attendance')}>
                            Attendance
                        </button>
                        <button className="btn btn-primary" onClick={() => setCurrentView('leaves')}>
                            Leaves
                        </button>
                        <button className="btn btn-primary" onClick={() => setCurrentView('payroll')}>
                            Payroll
                        </button>
                        <button className="btn" onClick={handleLogout} style={{ background: 'var(--danger)', color: 'white' }}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container" style={{ marginTop: '2rem' }}>
                {currentView === 'dashboard' && <Dashboard user={user} />}
                {currentView === 'attendance' && <Attendance user={user} />}
                {currentView === 'leaves' && <Leaves user={user} />}
                {currentView === 'payroll' && <Payroll user={user} />}
            </div>
        </div>
    )
}

export default App
