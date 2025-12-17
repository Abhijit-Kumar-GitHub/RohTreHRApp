import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard({ user }) {
    const [stats, setStats] = useState({
        attendance: 0,
        leaves: 0,
        pendingLeaves: 0
    })

    useEffect(() => {
        fetchStats()
    }, [user])

    const fetchStats = async () => {
        // Get attendance count
        const { count: attendanceCount } = await supabase
            .from('attendance')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)

        // Get leaves count
        const { count: leavesCount } = await supabase
            .from('leaves')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)

        // Get pending leaves
        const { count: pendingCount } = await supabase
            .from('leaves')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'pending')

        setStats({
            attendance: attendanceCount || 0,
            leaves: leavesCount || 0,
            pendingLeaves: pendingCount || 0
        })
    }

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Dashboard</h1>

            <div className="grid">
                <div className="card">
                    <h3 style={{ marginBottom: '0.5rem' }}>Total Attendance</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                        {stats.attendance}
                    </p>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '0.5rem' }}>Total Leaves</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                        {stats.leaves}
                    </p>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '0.5rem' }}>Pending Leaves</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--danger)' }}>
                        {stats.pendingLeaves}
                    </p>
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Welcome, {user.email}!</h2>
                <p>Use the navigation above to manage your attendance, leaves, and view payroll.</p>
            </div>
        </div>
    )
}
