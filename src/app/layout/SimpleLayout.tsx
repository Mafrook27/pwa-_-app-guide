import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X, FileText, Smartphone, Mail, Edit3, FileEdit } from "lucide-react";

export default function SimpleLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile-Optimized Navigation Bar */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <img
                                src="./logo.png"
                                alt="Cashback Loans"
                                className="h-8 sm:h-10 w-auto"
                            />
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex gap-2">
                            <Link
                                to="/pwa-app"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive("/pwa-app") || isActive("/")
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                    }`}
                            >
                                <Smartphone className="w-5 h-5" />
                                <span>PWA App Guide</span>
                            </Link>
                            <Link
                                to="/portal"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive("/portal")
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                    }`}
                            >
                                <FileText className="w-5 h-5" />
                                <span>Portal Guide</span>
                            </Link>
                            <Link
                                to="/form-editor"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive("/form-editor")
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                    }`}
                            >
                                <FileEdit className="w-5 h-5" />
                                <span>Form Editor</span>
                            </Link>
                            <Link
                                to="/email-editor"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive("/email-editor")
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                    }`}
                            >
                                <Mail className="w-5 h-5" />
                                <span>Email Editor</span>
                            </Link>
                            <Link
                                to="/inline-email-composer"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive("/inline-email-composer")
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                    }`}
                            >
                                <Edit3 className="w-5 h-5" />
                                <span>Inline Composer</span>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200">
                            <div className="flex flex-col gap-2">
                                <Link
                                    to="/pwa-app"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/pwa-app") || isActive("/")
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 hover:bg-blue-50"
                                        }`}
                                >
                                    <Smartphone className="w-5 h-5" />
                                    <span className="font-medium">PWA App Guide</span>
                                </Link>
                                <Link
                                    to="/portal"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/portal")
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 hover:bg-blue-50"
                                        }`}
                                >
                                    <FileText className="w-5 h-5" />
                                    <span className="font-medium">Portal Guide</span>
                                </Link>
                                <Link
                                    to="/form-editor"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/form-editor")
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 hover:bg-blue-50"
                                        }`}
                                >
                                    <FileEdit className="w-5 h-5" />
                                    <span className="font-medium">Form Editor</span>
                                </Link>
                                <Link
                                    to="/email-editor"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/email-editor")
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 hover:bg-blue-50"
                                        }`}
                                >
                                    <Mail className="w-5 h-5" />
                                    <span className="font-medium">Email Editor</span>
                                </Link>
                                <Link
                                    to="/inline-email-composer"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/inline-email-composer")
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 hover:bg-blue-50"
                                        }`}
                                >
                                    <Edit3 className="w-5 h-5" />
                                    <span className="font-medium">Inline Composer</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Page Content */}
            <main className="min-h-[calc(100vh-4rem)]">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-6 mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-600">
                        © {new Date().getFullYear()} Cashback Loans. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
