import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="container">
      <h1>{{ title }}</h1>
      <div class="form-grid">
        <div class="form-group">
          <label>Kredi Tutarı</label>
          <input
            [(ngModel)]="krediTutari"
            (ngModelChange)="formatKrediTutari($event)"
            type="text"
          />
        </div>
        <div class="form-group">
          <label>Faiz Oranı</label>
          <input
            [(ngModel)]="faizOrani"
            (ngModelChange)="formatFaizOrani($event)"
            type="text"
          />
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


      <div *ngIf="hesaplandi">
        <hr *ngIf="toplamGeriOdeme !== 0 || toplamOdenenFaiz !== 0"/>

        <div class="result-container" *ngIf="toplamOdenenFaiz !== 0">
          <p>
            <strong>Taksit Tutarı:</strong>
            {{ taksitTutari | currency : '₺' : 'symbol-narrow' }}
          </p>
          <p><strong>Taksit Sayısı:</strong> {{ taksitSayisi }}</p>
          <p>
            <strong>Toplam Geri Ödeme:</strong>
            {{ toplamGeriOdeme | currency : '₺' : 'symbol-narrow' }}
          </p>
          <p>
            <strong>Ödenecek Faiz Tutarı:</strong>
            {{ toplamOdenenFaiz | currency : '₺' : 'symbol-narrow' }}
          </p>
        </div>

        <!-- Ödeme Planı tablosu varsa <hr> göster -->
        <hr *ngIf="odemePlani.length > 0"/>

        <div class="table-container" *ngIf="odemePlani.length > 0">
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
                <td>{{ i + 1 }}</td>
                <td>{{ data.taksitTutari | currency : '₺' : 'symbol' }}</td>
                <td>{{ data.kalanGeriOdeme | currency : '₺' : 'symbol' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class AppComponent {
  title = 'KREDİMİ HESAPLA';
  krediTutari: number = 0;
  taksitSayisi: number = 3;
  faizOrani: number = 0;
  taksitler: number[] = [3, 6, 12, 24];

  result: string = '';
  taksitTutari: number = 0;
  toplamGeriOdeme: number = 0;
  hesaplandi: boolean = false;
  toplamOdenenFaiz: number = 0;

  odemePlani: { taksitTutari: number; kalanGeriOdeme: number }[] = [];

  formatFaizOrani(value: string) {
    this.faizOrani = parseFloat(value.replace(',', '.'));
  }

  formatKrediTutari(value: string) {
    const temizlenmisDeger = value.replace(/[^0-9,]/g, '').replace(',', '.');
    this.krediTutari = parseFloat(temizlenmisDeger) || 0;
  }

  odenecekFaizTutarı() {
    this.toplamOdenenFaiz = Math.round(this.toplamGeriOdeme - this.krediTutari);
  }

  hesapla() {
    this.taksitTutari = Math.round(
      (this.krediTutari / this.taksitSayisi) * this.faizOrani
    );
    this.toplamGeriOdeme = Math.round(this.taksitTutari * this.taksitSayisi);
    this.hesaplandi = true;

    this.odemePlani = [];
    let kalanGeriOdeme = this.toplamGeriOdeme;
    for (let i = 0; i < this.taksitSayisi; i++) {
      kalanGeriOdeme -= this.taksitTutari;
      const data = {
        taksitTutari: this.taksitTutari,
        kalanGeriOdeme: Math.round(kalanGeriOdeme),
      };
      this.odemePlani.push(data);
    }

    this.odenecekFaizTutarı();
  }
}
