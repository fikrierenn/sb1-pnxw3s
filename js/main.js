// Ana uygulama modülü
import { VeriYonetimi } from './veriYonetimi.js';
import { IstatistikYonetimi } from './istatistikYonetimi.js';
import { ArayuzYonetimi } from './arayuzYonetimi.js';
import { RaporYonetimi } from './raporYonetimi.js';

class Uygulama {
    constructor() {
        this.veriYonetimi = new VeriYonetimi();
        this.arayuzYonetimi = new ArayuzYonetimi();
    }

    async baslat() {
        try {
            const hareketler = await this.veriYonetimi.veriGetir();
            this.istatistikYonetimi = new IstatistikYonetimi(hareketler);
            this.raporYonetimi = new RaporYonetimi(hareketler);
            
            // Son tarihi tarih filtresine ayarla
            const sonTarih = this.veriYonetimi.getSonTarih();
            this.arayuzYonetimi.tarihFiltresiniAyarla(sonTarih);
            
            this.panelGuncelle();
            this.filtrelemeDinleyicileriniEkle();
            this.raporDinleyicileriniEkle();
        } catch (hata) {
            console.error('Uygulama başlatılırken hata:', hata);
        }
    }

    raporDinleyicileriniEkle() {
        const raporButonu = document.getElementById('showStoreReport');
        if (raporButonu) {
            raporButonu.addEventListener('click', () => {
                const dukkanOzeti = this.raporYonetimi.dukkanOzetiHazirla();
                const raporPenceresi = window.open('rapor.html', '_blank');
                
                raporPenceresi.addEventListener('DOMContentLoaded', () => {
                    raporPenceresi.postMessage({ tip: 'dukkanRaporu', veri: dukkanOzeti }, '*');
                });
            });
        }
    }

    // ... (diğer mevcut metodlar aynı kalacak)
}

// Uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    const uygulama = new Uygulama();
    uygulama.baslat();
});