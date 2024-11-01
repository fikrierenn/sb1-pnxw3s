// Veri yapısı
let hareketler = [];

// Veri yönetimi
const veriYoneticisi = {
    async veriGetir() {
        try {
            const yanit = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSYHDE26yHYcMX7fPk4V9KOBJ70WAcKwzRbrFtmhHQ9m5N3kJNBpgyS_nvtk2fUbd0pcfkGSFqjAX33/pub?gid=1487137333&single=true&output=csv');
            const veri = await yanit.text();
            hareketler = this.csvAyristir(veri);
            panelGuncelle();
        } catch (hata) {
            console.error('Veri yüklenirken hata oluştu:', hata);
        }
    },

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
    },

    tarihFormatiDuzenle(tarihStr) {
        if (!tarihStr) return '';
        
        const [tarih, saat] = tarihStr.split(' ');
        if (!tarih) return '';

        const [gun, ay, yil] = tarih.split('.');
        if (!gun || !ay || !yil) return tarihStr;

        return `${yil.padStart(4, '20')}-${ay.padStart(2, '0')}-${gun.padStart(2, '0')}${saat ? ' ' + saat : ''}`;
    }
};

// İstatistik işlemleri
const istatistikYoneticisi = {
    hesaplaGunluk() {
        const bugun = new Date();
        bugun.setHours(0, 0, 0, 0);

        const gunlukHareketler = hareketler.filter(hareket => {
            const hareketTarihi = new Date(hareket.tarihObj);
            hareketTarihi.setHours(0, 0, 0, 0);
            return hareketTarihi.getTime() === bugun.getTime();
        });

        const girisler = gunlukHareketler.filter(h => h.isGiris);
        const cikislar = gunlukHareketler.filter(h => !h.isGiris);

        const toplamGiris = girisler.reduce((toplam, h) => toplam + h.kasaAdet, 0);
        const toplamCikis = cikislar.reduce((toplam, h) => toplam + h.kasaAdet, 0);
        const netKasa = toplamGiris - toplamCikis;
        const toplamRehin = gunlukHareketler.reduce((toplam, h) => toplam + h.rehinTutar, 0);

        return {
            giris: toplamGiris,
            cikis: toplamCikis,
            net: netKasa,
            rehin: toplamRehin,
            islemSayisi: gunlukHareketler.length
        };
    },

    hesaplaGenel() {
        const girisler = hareketler.filter(h => h.isGiris);
        const cikislar = hareketler.filter(h => !h.isGiris);

        const toplamGiris = girisler.reduce((toplam, h) => toplam + h.kasaAdet, 0);
        const toplamCikis = cikislar.reduce((toplam, h) => toplam + h.kasaAdet, 0);
        const netKasa = toplamGiris - toplamCikis;
        const toplamRehin = hareketler.reduce((toplam, h) => toplam + h.rehinTutar, 0);

        return {
            giris: toplamGiris,
            cikis: toplamCikis,
            net: netKasa,
            rehin: toplamRehin,
            islemSayisi: hareketler.length
        };
    },

    istatistikleriGuncelle() {
        const gunluk = this.hesaplaGunluk();
        const genel = this.hesaplaGenel();

        // Günlük istatistikler
        document.getElementById('dailyInBoxes').textContent = gunluk.giris.toLocaleString('tr-TR');
        document.getElementById('dailyOutBoxes').textContent = gunluk.cikis.toLocaleString('tr-TR');
        document.getElementById('dailyNetBoxes').textContent = gunluk.net.toLocaleString('tr-TR');
        document.getElementById('dailyPledge').textContent = `₺${gunluk.rehin.toLocaleString('tr-TR')}`;
        document.getElementById('dailyTransactions').textContent = gunluk.islemSayisi.toLocaleString('tr-TR');

        // Genel istatistikler
        document.getElementById('totalInBoxes').textContent = genel.giris.toLocaleString('tr-TR');
        document.getElementById('totalOutBoxes').textContent = genel.cikis.toLocaleString('tr-TR');
        document.getElementById('totalNetBoxes').textContent = genel.net.toLocaleString('tr-TR');
        document.getElementById('totalPledge').textContent = `₺${genel.rehin.toLocaleString('tr-TR')}`;
        document.getElementById('totalTransactions').textContent = genel.islemSayisi.toLocaleString('tr-TR');
    }
};

// Tablo işlemleri
const tabloYoneticisi = {
    tabloGuncelle(hareketListesi = hareketler) {
        const tbody = document.querySelector('#transactionsTable tbody');
        tbody.innerHTML = hareketListesi
            .sort((a, b) => b.tarihObj - a.tarihObj)
            .map(hareket => `
                <tr>
                    <td>${hareket.halNo}</td>
                    <td>${hareket.islemTuru}</td>
                    <td>${hareket.kasaAdet.toLocaleString('tr-TR')}</td>
                    <td>${this.formatTarih(hareket.tarihObj)}</td>
                    <td>₺${hareket.rehinTutar.toLocaleString('tr-TR')}</td>
                    <td>
                        <span class="material-icons" style="cursor: pointer; color: #1a73e8;" title="Düzenle">edit</span>
                        <span class="material-icons" style="cursor: pointer; color: #dc3545;" title="Sil">delete</span>
                    </td>
                </tr>
            `).join('');
    },

    formatTarih(tarih) {
        return new Intl.DateTimeFormat('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(tarih);
    },

    hareketleriFiltrele(aramaMetni) {
        const filtreli = hareketler.filter(hareket => 
            hareket.halNo.toLowerCase().includes(aramaMetni) ||
            hareket.islemTuru.toLowerCase().includes(aramaMetni)
        );
        this.tabloGuncelle(filtreli);
    }
};

// Arama işlemleri
const aramaYoneticisi = {
    dinleyicileriEkle() {
        document.getElementById('halNoFilter').addEventListener('input', (e) => {
            tabloYoneticisi.hareketleriFiltrele(e.target.value.toLowerCase());
        });

        document.getElementById('generalSearch').addEventListener('input', (e) => {
            tabloYoneticisi.hareketleriFiltrele(e.target.value.toLowerCase());
        });

        document.getElementById('dateFilter').addEventListener('change', (e) => {
            const secilenTarih = new Date(e.target.value);
            secilenTarih.setHours(0, 0, 0, 0);

            const filtreli = hareketler.filter(hareket => {
                const hareketTarihi = new Date(hareket.tarihObj);
                hareketTarihi.setHours(0, 0, 0, 0);
                return hareketTarihi.getTime() === secilenTarih.getTime();
            });
            
            tabloYoneticisi.tabloGuncelle(filtreli);
        });
    }
};

// Panel güncelleme
function panelGuncelle() {
    istatistikYoneticisi.istatistikleriGuncelle();
    tabloYoneticisi.tabloGuncelle();
}

// Uygulama başlangıcı
document.addEventListener('DOMContentLoaded', () => {
    veriYoneticisi.veriGetir();
    aramaYoneticisi.dinleyicileriEkle();
});