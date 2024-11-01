// Arayüz güncellemeleri için modül
export class ArayuzYonetimi {
    constructor() {
        this.tabloGovdesi = document.querySelector('#transactionsTable tbody');
        this.aramaInputlari = {
            tarih: document.getElementById('dateFilter'),
            halNo: document.getElementById('halNoFilter'),
            genel: document.getElementById('generalSearch')
        };
    }

    tarihFiltresiniAyarla(tarih) {
        if (tarih) {
            this.aramaInputlari.tarih.value = tarih;
        }
    }

    istatistikleriGuncelle(gunluk, genel) {
        // Günlük istatistikler
        this.sayiGuncelle('dailyInBoxes', gunluk.giris);
        this.sayiGuncelle('dailyOutBoxes', gunluk.cikis);
        this.sayiGuncelle('dailyNetBoxes', gunluk.net);
        this.paraGuncelle('dailyPledge', gunluk.rehin);
        this.sayiGuncelle('dailyTransactions', gunluk.islemSayisi);

        // Genel istatistikler
        this.sayiGuncelle('totalInBoxes', genel.giris);
        this.sayiGuncelle('totalOutBoxes', genel.cikis);
        this.sayiGuncelle('totalNetBoxes', genel.net);
        this.paraGuncelle('totalPledge', genel.rehin);
        this.sayiGuncelle('totalTransactions', genel.islemSayisi);
    }

    sayiGuncelle(elementId, deger) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = deger.toLocaleString('tr-TR');
        }
    }

    paraGuncelle(elementId, deger) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = `₺${deger.toLocaleString('tr-TR')}`;
        }
    }

    tabloGuncelle(hareketListesi) {
        this.tabloGovdesi.innerHTML = hareketListesi
            .sort((a, b) => b.tarihObj - a.tarihObj)
            .map(hareket => this.hareketSatiriOlustur(hareket))
            .join('');
    }

    hareketSatiriOlustur(hareket) {
        return `
            <tr>
                <td>${hareket.halNo}</td>
                <td>${hareket.islemTuru}</td>
                <td>${hareket.kasaAdet.toLocaleString('tr-TR')}</td>
                <td>${this.tarihFormatla(hareket.tarihObj)}</td>
                <td>₺${hareket.rehinTutar.toLocaleString('tr-TR')}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" title="Düzenle">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" title="Sil">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }

    tarihFormatla(tarih) {
        return new Intl.DateTimeFormat('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(tarih);
    }

    aramaFiltreleriniEkle(filtrelemeIslevi) {
        Object.values(this.aramaInputlari).forEach(input => {
            input.addEventListener('input', filtrelemeIslevi);
        });
        
        // Tarih değişikliği için özel olay dinleyici
        this.aramaInputlari.tarih.addEventListener('change', filtrelemeIslevi);
    }
}