import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Leaves({ user }) {
    const [leaves, setLeaves] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        leave_type: 'casual',
        start_date: '',
        end_date: '',
        reason: ''
    })

    useEffect(() => {
        fetchLeaves()
    }, [user])

    const fetchLeaves = async () => {
        const { data } = await supabase
            .from('leaves')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        setLeaves(data || [])
    }

    const calculateDays = () => {
        if (!formData.start_date || !formData.end_date) return 0
        const start = new Date(formData.start_date)
        const end = new Date(formData.end_date)
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
        return days > 0 ? days : 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const { error } = await supabase
            .from('leaves')
            .insert({
                user_id: user.id,
                ...formData,
                total_days: calculateDays()
            })

        if (!error) {
            alert('Leave application submitted!')
            setShowForm(false)
            setFormData({ leave_type: 'casual', start_date: '', end_date: '', reason: '' })
            fetchLeaves()
        }
    }

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <h1>Leave Management</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Apply Leave'}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Apply for Leave</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Leave Type</label>
                            <select
                                className="input"
                                value={formData.leave_type}
                                onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                            >
                                <option value="casual">Casual Leave</option>
                                <option value="sick">Sick Leave</option>
                                <option value="earned">Earned Leave</option>
                                <option value="unpaid">Unpaid Leave</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Start Date</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>End Date</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Total Days: {calculateDays()}
                            </label>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Reason</label>
                            <textarea
                                className="input"
                                rows="3"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Submit Application
                        </button>
                    </form>
                </div>
            )}

            <div className="card">
                <h2 style={{ marginBottom: '1rem' }}>Leave History</h2>
                {leaves.length === 0 ? (
                    <p>No leave applications yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Type</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Start Date</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>End Date</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Days</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map((leave) => (
                                    <tr key={leave.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '0.75rem' }}>{leave.leave_type}</td>
                                        <td style={{ padding: '0.75rem' }}>
                                            {new Date(leave.start_date).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            {new Date(leave.end_date).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>{leave.total_days || '-'}</td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <span className={`badge badge-${leave.status === 'approved' ? 'success' :
                                                    leave.status === 'rejected' ? 'danger' : 'warning'
                                                }`}>
                                                {leave.status}
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
