import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
     <div class="container">
      <h1>{{title}}</h1>
      <div class="form-grid">
        <div class="form-group">
          <label>Kredi Tutarı</label>
          <input [(ngModel)]="krediTutari" type="number">
        </div>
        <div class="form-group">
          <label>Faiz Oranı</label>
          <input [(ngModel)]="faizOrani" (ngModelChange)="formatFaizOrani($event)" type="text">
        </div>
        <div class="form-group">
          <label>Taksit Sayısı</label>
          <select [(ngModel)]="taksitSayisi">
            <option *ngFor="let data of taksitler">{{ data }}</option>
          </select>
        </div>
      </div>
      <div class="button-container">
        <button (click)="hesapla()">Hesapla</button>
      </div>
      <hr>
      <h1>{{result}}</h1>
      <hr>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Taksit</th>
              <th>Taksit Tutarı</th>
              <th>Kalan Geri Ödeme</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of odemePlani; let i = index">
              <td>{{i + 1}}</td>
              <td>{{data.taksitTutari}}</td>
              <td>{{data.kalanGeriOdeme}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AppComponent {
  title = 'KREDİMİ HESAPLA';
  krediTutari: number = 0;
  taksitSayisi: number = 3;
  faizOrani: number = 0;
  taksitler: number[] = [3, 6, 12, 24];

  result: string = '';

  odemePlani: { taksitTutari: number, kalanGeriOdeme: number }[] = [];

  // Method to format faizOrani when user enters comma
  formatFaizOrani(value: string) {
    this.faizOrani = parseFloat(value.replace(',', '.'));
  }

  hesapla() {
    const taksitTutari: number = Math.round((this.krediTutari / this.taksitSayisi) * this.faizOrani);
    let toplamGeriOdeme: number = Math.round(taksitTutari * this.taksitSayisi);

    this.result = `Taksit Tutarı: ${taksitTutari} - Taksit Sayısı: ${this.taksitSayisi} - Toplam Geri Ödeme: ${toplamGeriOdeme}`;

    this.odemePlani = [];
    for (let i = 0; i < this.taksitSayisi; i++) {
      toplamGeriOdeme -= taksitTutari;
      const data = {
        taksitTutari: taksitTutari,
        kalanGeriOdeme: Math.round(toplamGeriOdeme)
      };

      this.odemePlani.push(data);
    }
  }
}
