// Veri yapısı ve yönetimi için modül
export class VeriYonetimi {
    constructor() {
        this.hareketler = [];
        this.sonTarih = null;
    }

    async veriGetir() {
        try {
            const yanit = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSYHDE26yHYcMX7fPk4V9KOBJ70WAcKwzRbrFtmhHQ9m5N3kJNBpgyS_nvtk2fUbd0pcfkGSFqjAX33/pub?gid=1487137333&single=true&output=csv');
            const veri = await yanit.text();
            this.hareketler = this.csvAyristir(veri);
            this.sonTarihiBul();
            return this.hareketler;
        } catch (hata) {
            console.error('Veri yüklenirken hata oluştu:', hata);
            throw hata;
        }
    }

    sonTarihiBul() {
        if (this.hareketler.length > 0) {
            const tarihler = this.hareketler.map(h => h.tarihObj);
            this.sonTarih = new Date(Math.max(...tarihler));
        }
    }

    getSonTarih() {
        return this.sonTarih ? this.sonTarih.toISOString().split('T')[0] : null;
    }

    csvAyristir(csv) {
        const satirlar = csv.split('\n');
        const basliklar = satirlar[0].split(',').map(baslik => baslik.trim());
        
        return satirlar.slice(1)
            .filter(satir => satir.trim() !== '')
            .map(satir => {
                const degerler = satir.split(',').map(deger => deger.trim());
                const tarihSaat = this.tarihFormatiDuzenle(degerler[3]);
                const islemTuru = degerler[1].toLowerCase();
                const kasaAdet = parseInt(degerler[2]) || 0;
                
                return {
                    halNo: degerler[0],
                    islemTuru: degerler[1],
                    kasaAdet: Math.abs(kasaAdet),
                    isGiris: islemTuru.includes('giriş') || islemTuru.includes('giris'),
                    tarihSaat: tarihSaat,
                    rehinTutar: Math.abs(parseFloat(degerler[4]) || 0),
                    tarihObj: new Date(tarihSaat)
                };
            })
            .filter(hareket => !isNaN(hareket.tarihObj.getTime()));
    }

    tarihFormatiDuzenle(tarihStr) {
        if (!tarihStr) return '';
        
        const [tarih, saat] = tarihStr.split(' ');
        if (!tarih) return '';

        const [gun, ay, yil] = tarih.split('.');
        if (!gun || !ay || !yil) return tarihStr;

        return `${yil.padStart(4, '20')}-${ay.padStart(2, '0')}-${gun.padStart(2, '0')}${saat ? ' ' + saat : ''}`;
    }
}