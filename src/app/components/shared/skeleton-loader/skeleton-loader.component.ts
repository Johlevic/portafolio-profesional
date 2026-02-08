import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex flex-col md:flex-row min-h-screen bg-gray-900 overflow-hidden"
    >
      <!-- SIDEBAR SKELETON (PC/Tablet) -->
      <aside
        class="hidden md:flex fixed top-0 left-0 h-screen w-24 lg:w-72 bg-gray-800 border-r border-blue-500/10 flex-col py-8 z-50"
      >
        <!-- Brand Circle -->
        <div class="px-2 lg:px-8 mb-10 flex justify-center">
          <div
            class="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-gray-700 shimmer-element"
          ></div>
        </div>
        <!-- Nav Items -->
        <div class="flex-1 px-4 space-y-4">
          <div
            *ngFor="let i of [1, 2, 3, 4, 5, 6]"
            class="h-12 w-full rounded-lg bg-gray-700 shimmer-element"
          ></div>
        </div>
        <!-- Footer Icons -->
        <div class="px-8 flex justify-around mt-8">
          <div class="w-8 h-8 rounded-full bg-gray-700 shimmer-element"></div>
          <div class="w-8 h-8 rounded-full bg-gray-700 shimmer-element"></div>
          <div class="w-8 h-8 rounded-full bg-gray-700 shimmer-element"></div>
        </div>
      </aside>

      <!-- TOP HEADER SKELETON (Mobile) -->
      <header
        class="md:hidden fixed top-0 left-0 w-full h-20 bg-gray-900 border-b border-blue-500/10 z-50 flex items-center px-6 justify-between"
      >
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-lg bg-gray-700 shimmer-element"></div>
          <div class="w-24 h-6 rounded bg-gray-700 shimmer-element"></div>
        </div>
        <div class="w-10 h-10 rounded-xl bg-gray-700 shimmer-element"></div>
      </header>

      <!-- MAIN CONTENT SKELETON -->
      <main class="flex-1 md:ml-24 lg:ml-72 pt-24 md:pt-16 p-8 space-y-12">
        <!-- Hero Skeleton -->
        <div
          class="container mx-auto flex flex-col items-center md:items-start space-y-6"
        >
          <div
            class="w-[80%] md:w-[60%] h-12 md:h-20 rounded bg-gray-700 shimmer-element"
          ></div>
          <div
            class="w-[60%] md:w-[40%] h-8 md:h-12 rounded bg-gray-700 shimmer-element"
          ></div>
          <div
            class="w-full md:w-[80%] h-32 rounded bg-gray-700 shimmer-element"
          ></div>
          <div class="flex gap-4">
            <div class="w-40 h-12 rounded-lg bg-gray-700 shimmer-element"></div>
            <div class="w-40 h-12 rounded-lg bg-gray-700 shimmer-element"></div>
          </div>
        </div>

        <!-- Section Title Placeholder -->
        <div class="flex justify-center mt-20">
          <div class="w-64 h-10 rounded bg-gray-700 shimmer-element"></div>
        </div>

        <!-- Cards Grid Placeholder -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto"
        >
          <div
            *ngFor="let i of [1, 2, 3, 4]"
            class="h-48 rounded-xl bg-gray-700 shimmer-element"
          ></div>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .shimmer-element {
        position: relative;
        overflow: hidden;
      }

      .shimmer-element::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background-image: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0,
          rgba(255, 255, 255, 0.05) 20%,
          rgba(255, 255, 255, 0.1) 60%,
          rgba(255, 255, 255, 0)
        );
        animation: shimmer 2s infinite ease-out;
      }

      @keyframes shimmer {
        100% {
          transform: translateX(100%);
        }
      }
    `,
  ],
})
export class SkeletonLoaderComponent {}
