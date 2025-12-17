import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Attendance({ user }) {
    const [todayRecord, setTodayRecord] = useState(null)
    const [history, setHistory] = useState([])
    const [location, setLocation] = useState(null)

    useEffect(() => {
        fetchTodayAttendance()
        fetchHistory()
    }, [user])

    const fetchTodayAttendance = async () => {
        const today = new Date().toISOString().split('T')[0]
        const { data } = await supabase
            .from('attendance')
            .select('*')
            .eq('user_id', user.id)
            .gte('check_in', `${today}T00:00:00`)
            .lte('check_in', `${today}T23:59:59`)
            .single()

        setTodayRecord(data)
    }

    const fetchHistory = async () => {
        const { data } = await supabase
            .from('attendance')
            .select('*')
            .eq('user_id', user.id)
            .order('check_in', { ascending: false })
            .limit(10)

        setHistory(data || [])
    }

    const getLocation = () => {
        return new Promise((resolve) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        })
                    },
                    () => resolve(null)
                )
            } else {
                resolve(null)
            }
        })
    }

    const handleCheckIn = async () => {
        const loc = await getLocation()

        const { error } = await supabase
            .from('attendance')
            .insert({
                user_id: user.id,
                check_in: new Date().toISOString(),
                location: loc,
                status: 'present'
            })

        if (!error) {
            alert('Checked in successfully!')
            fetchTodayAttendance()
            fetchHistory()
        }
    }

    const handleCheckOut = async () => {
        const loc = await getLocation()

        const { error } = await supabase
            .from('attendance')
            .update({
                check_out: new Date().toISOString()
            })
            .eq('id', todayRecord.id)

        if (!error) {
            alert('Checked out successfully!')
            fetchTodayAttendance()
            fetchHistory()
        }
    }

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Attendance</h1>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Today's Attendance</h2>

                {!todayRecord ? (
                    <button className="btn btn-primary" onClick={handleCheckIn}>
                        Check In
                    </button>
                ) : !todayRecord.check_out ? (
                    <div>
                        <p style={{ marginBottom: '1rem' }}>
                            Checked in at: {new Date(todayRecord.check_in).toLocaleTimeString()}
                        </p>
                        <button className="btn btn-primary" onClick={handleCheckOut}>
                            Check Out
                        </button>
                    </div>
                ) : (
                    <div>
                        <p>Checked in: {new Date(todayRecord.check_in).toLocaleTimeString()}</p>
                        <p>Checked out: {new Date(todayRecord.check_out).toLocaleTimeString()}</p>
                    </div>
                )}
            </div>

            <div className="card">
                <h2 style={{ marginBottom: '1rem' }}>Attendance History</h2>
                {history.length === 0 ? (
                    <p>No attendance records yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Check In</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Check Out</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((record) => (
                                    <tr key={record.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '0.75rem' }}>
                                            {new Date(record.check_in).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            {new Date(record.check_in).toLocaleTimeString()}
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            {record.check_out ? new Date(record.check_out).toLocaleTimeString() : '-'}
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <span className={`badge badge-${record.status === 'present' ? 'success' : 'warning'}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
