import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase chunk size warning limit to avoid warnings for large libraries
    // زيادة حد تحذير حجم الـ chunk لتجنب التحذيرات للمكتبات الكبيرة
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better code splitting and caching
        // تقسيم الـ chunks يدوياً لتحسين تقسيم الكود والتخزين المؤقت
        manualChunks: {
          // React core libraries - most commonly used
          // المكتبات الأساسية لـ React - الأكثر استخداماً
          react: ['react', 'react-dom', 'react-router-dom'],
          
          // Authentication library - large and used in specific routes
          // مكتبة المصادقة - كبيرة وتستخدم في مسارات محددة
          clerk: ['@clerk/clerk-react'],
          
          // UI libraries - loaded only when needed (swiper in TrustedBy, quill in AddJob)
          // مكتبات الواجهة - يتم تحميلها عند الحاجة فقط
          swiper: ['swiper'],
          quill: ['quill', 'react-quill'],
          
          // Utility libraries - commonly used across the app
          // مكتبات الأدوات المساعدة - مستخدمة بشكل شائع في التطبيق
          utils: ['axios', 'moment', 'react-toastify'],
        },
      },
    },
    // Enable source maps for production debugging (optional)
    // تفعيل source maps لتسهيل التصحيح في الإنتاج (اختياري)
    sourcemap: false,
    // Optimize chunk size and tree shaking
    // تحسين حجم الـ chunks وإزالة الكود غير المستخدم
    // Vite uses esbuild for minification by default (faster than terser)
    // Vite يستخدم esbuild للتصغير بشكل افتراضي (أسرع من terser)
    minify: 'esbuild',
  },
  // Optimize dependencies
  // تحسين التبعيات
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['moment'], // Exclude moment to reduce bundle size initially
  },
})
