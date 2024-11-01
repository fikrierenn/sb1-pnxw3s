// İstatistik hesaplamaları için modül
export class IstatistikYonetimi {
    constructor(hareketler) {
        this.hareketler = hareketler;
    }

    hesaplaGunluk(secilenTarih = null) {
        const tarih = secilenTarih ? new Date(secilenTarih) : new Date();
        tarih.setHours(0, 0, 0, 0);

        const gunlukHareketler = this.hareketler.filter(hareket => {
            const hareketTarihi = new Date(hareket.tarihObj);
            hareketTarihi.setHours(0, 0, 0, 0);
            return hareketTarihi.getTime() === tarih.getTime();
        });

        return this.hesaplaOzet(gunlukHareketler);
    }

    hesaplaGenel() {
        return this.hesaplaOzet(this.hareketler);
    }

    hesaplaOzet(hareketListesi) {
        const girisler = hareketListesi.filter(h => h.isGiris);
        const cikislar = hareketListesi.filter(h => !h.isGiris);

        const toplamGiris = girisler.reduce((toplam, h) => toplam + h.kasaAdet, 0);
        const toplamCikis = cikislar.reduce((toplam, h) => toplam + h.kasaAdet, 0);
        const netKasa = toplamGiris - toplamCikis;
        const toplamRehin = hareketListesi.reduce((toplam, h) => toplam + h.rehinTutar, 0);

        return {
            giris: toplamGiris,
            cikis: toplamCikis,
            net: netKasa,
            rehin: toplamRehin,
            islemSayisi: hareketListesi.length
        };
    }
}