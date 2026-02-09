import { Injectable, signal } from '@angular/core';

export interface LoadingState {
  isActive: boolean;
  progress: number;
  showSuccess: boolean;
  titleKey?: string;
  descriptionKey?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoadingModalService {
  private initialState: LoadingState = {
    isActive: false,
    progress: 0,
    showSuccess: false,
  };

  state = signal<LoadingState>(this.initialState);

  show(titleKey?: string, descriptionKey?: string) {
    this.state.set({
      isActive: true,
      progress: 0,
      showSuccess: false,
      titleKey,
      descriptionKey,
    });
  }

  setProgress(progress: number) {
    this.state.update((s) => ({ ...s, progress }));
  }

  setSuccess(show: boolean) {
    this.state.update((s) => ({ ...s, showSuccess: show }));
  }

  hide() {
    this.state.set(this.initialState);
  }
}
