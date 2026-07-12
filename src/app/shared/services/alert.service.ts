import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  success(title: string, text: string) {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#0d6efd'
    });
  }

  error(title: string, text: string) {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#dc3545'
    });
  }

  warning(title: string, text: string) {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: '#ffc107'
    });
  }

  confirm(title: string, text: string) {
    return Swal.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#6c757d'
    });
  }

  loading(title = 'Procesando...') {

    Swal.fire({
      title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

  }

  close() {
    Swal.close();
  }

}