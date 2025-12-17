import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Payroll({ user }) {
    const [payrolls, setPayrolls] = useState([])
    const [selectedPayroll, setSelectedPayroll] = useState(null)

    useEffect(() => {
        fetchPayrolls()
    }, [user])

    const fetchPayrolls = async () => {
        const { data } = await supabase
            .from('payroll')
            .select('*')
            .eq('user_id', user.id)
            .order('year', { ascending: false })
            .order('month', { ascending: false })

        setPayrolls(data || [])
    }

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Payroll & Payslips</h1>

            <div className="card">
                <h2 style={{ marginBottom: '1rem' }}>Payroll History</h2>
                {payrolls.length === 0 ? (
                    <p>No payroll records yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Period</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Base Salary</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Net Salary</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payrolls.map((payroll) => (
                                    <tr key={payroll.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '0.75rem' }}>
                                            {monthNames[payroll.month - 1]} {payroll.year}
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>₹{payroll.base_salary}</td>
                                        <td style={{ padding: '0.75rem' }}>₹{payroll.net_salary}</td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <span className={`badge badge-${payroll.status === 'paid' ? 'success' :
                                                    payroll.status === 'processed' ? 'warning' : 'danger'
                                                }`}>
                                                {payroll.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                                onClick={() => setSelectedPayroll(payroll)}
                                            >
                                                View Payslip
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedPayroll && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        zIndex: 1000
                    }}
                    onClick={() => setSelectedPayroll(null)}
                >
                    <div
                        className="card"
                        style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                            <h2>Payslip</h2>
                            <button
                                onClick={() => setSelectedPayroll(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text)',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            <h3>RohTre Media Pvt. Ltd.</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                {monthNames[selectedPayroll.month - 1]} {selectedPayroll.year}
                            </p>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                                <span>Employee:</span>
                                <strong>{user.email}</strong>
                            </div>
                            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                                <span>Base Salary:</span>
                                <strong>₹{selectedPayroll.base_salary}</strong>
                            </div>
                            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                                <span>Deductions:</span>
                                <strong>₹{selectedPayroll.deductions || 0}</strong>
                            </div>
                            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                                <span>Bonuses:</span>
                                <strong>₹{selectedPayroll.bonuses || 0}</strong>
                            </div>
                        </div>

                        <div
                            style={{
                                borderTop: '2px solid var(--primary)',
                                paddingTop: '1rem',
                                marginTop: '1rem'
                            }}
                        >
                            <div className="flex-between">
                                <strong style={{ fontSize: '1.25rem' }}>Net Salary:</strong>
                                <strong style={{ fontSize: '1.25rem', color: 'var(--success)' }}>
                                    ₹{selectedPayroll.net_salary}
                                </strong>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '1.5rem' }}
                            onClick={() => window.print()}
                        >
                            Print Payslip
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
