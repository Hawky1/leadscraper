import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import {
    Bell,
    CheckCircle2,
    AlertCircle,
    Info,
    XCircle,
    Check,
    Trash2,
    Clock,
    Sparkles,
    Crosshair,
    Map
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Notification {
    id: string
    user_id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    is_read: boolean
    link: string | null
    created_at: string
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        user_id: 'mock',
        title: 'Lead Search Completed',
        message: 'Your search for "Plumbers in Sydney" is ready with 25 new leads.',
        type: 'success',
        is_read: false,
        link: '/lead-gen',
        created_at: new Date().toISOString()
    },
    {
        id: '2',
        user_id: 'mock',
        title: 'Roadmap Generated',
        message: 'A new growth plan for "Real Estate" has been created.',
        type: 'info',
        is_read: true,
        link: '/roadmap',
        created_at: new Date(Date.now() - 3600000).toISOString()
    }
]

const NotificationDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const queryClient = useQueryClient()

    // Fetch notifications
    const { data: notifications = [] } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            if (!isSupabaseConfigured) return MOCK_NOTIFICATIONS

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return []

            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data as Notification[]
        },
        refetchInterval: 30000 // Poll every 30s
    })

    const unreadCount = notifications.filter(n => !n.is_read).length

    // Mutations
    const markAsRead = useMutation({
        mutationFn: async (id: string) => {
            if (!isSupabaseConfigured) return
            await supabase.from('notifications').update({ is_read: true }).eq('id', id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
        }
    })

    const markAllAsRead = useMutation({
        mutationFn: async () => {
            if (!isSupabaseConfigured) return
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
        }
    })

    const deleteNotification = useMutation({
        mutationFn: async (id: string) => {
            if (!isSupabaseConfigured) return
            await supabase.from('notifications').delete().eq('id', id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
        }
    })

    // Auto-close dropdown when clicking outside
    useEffect(() => {
        if (!isOpen) return
        const handleClick = () => setIsOpen(false)
        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [isOpen])

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="text-[#34D399]" size={18} />
            case 'error': return <XCircle className="text-[#FF5C8E]" size={18} />
            case 'warning': return <AlertCircle className="text-[#FBBF24]" size={18} />
            default: return <Info className="text-[#3965FF]" size={18} />
        }
    }

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr)
        const diffMs = Date.now() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        return date.toLocaleDateString()
    }

    return (
        <div className="relative" onClick={e => e.stopPropagation()}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 text-[#A3AED0] hover:text-[#1B2559] transition-colors rounded-full hover:bg-[#F4F7FE] relative"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 h-2 w-2 bg-[#FF5C8E] rounded-full border-2 border-white animate-pulse" />
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-[#E9EDF7] overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="p-5 border-b border-[#E9EDF7] flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0">
                        <div>
                            <h4 className="text-sm font-bold text-[#1B2559]">Notifications</h4>
                            <p className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-wider">
                                {unreadCount} Unread
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllAsRead.mutate()}
                                className="text-[11px] font-bold text-[#3965FF] hover:text-[#0031E3] transition-colors flex items-center gap-1"
                            >
                                <Check size={12} /> Mark all read
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-[#F4F7FE]">
                                {notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            "p-4 transition-all hover:bg-[#F4F7FE]/50 relative group",
                                            !notification.is_read && "bg-[#F4F7FE]/30"
                                        )}
                                        onClick={() => {
                                            if (!notification.is_read) markAsRead.mutate(notification.id)
                                        }}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1 shrink-0">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <h5 className="text-xs font-bold text-[#1B2559] truncate pr-4">
                                                        {notification.title}
                                                    </h5>
                                                    <span className="text-[10px] font-medium text-[#A3AED0] whitespace-nowrap">
                                                        {formatTime(notification.created_at)}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] font-medium text-[#707EAE] leading-relaxed mb-2">
                                                    {notification.message}
                                                </p>

                                                <div className="flex items-center gap-2">
                                                    {!notification.is_read && (
                                                        <span className="h-1.5 w-1.5 bg-[#3965FF] rounded-full" />
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            deleteNotification.mutate(notification.id)
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-[#FF5C8E] hover:text-[#FF2D6E]"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 px-6 text-center">
                                <div className="h-12 w-12 bg-[#F4F7FE] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="text-[#D3D8E8]" size={24} />
                                </div>
                                <h5 className="text-sm font-bold text-[#1B2559]">All caught up!</h5>
                                <p className="text-[11px] font-medium text-[#A3AED0] mt-1">
                                    No new notifications at the moment.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 bg-[#F4F7FE]/50 border-t border-[#E9EDF7] text-center">
                        <button className="text-[11px] font-bold text-[#707EAE] hover:text-[#1B2559] transition-colors">
                            View all history
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotificationDropdown
