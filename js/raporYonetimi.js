// Rapor işlemleri için modül
export class RaporYonetimi {
    constructor(hareketler) {
        this.hareketler = hareketler;
    }

    dukkanOzetiHazirla() {
        const dukkanlar = new Map();

        // Her dükkan için verileri topla
        this.hareketler.forEach(hareket => {
            if (!dukkanlar.has(hareket.halNo)) {
                dukkanlar.set(hareket.halNo, {
                    halNo: hareket.halNo,
                    toplamGiris: 0,
                    toplamCikis: 0,
                    kalanKasa: 0,
                    rehinTutar: 0
                });
            }

            const dukkan = dukkanlar.get(hareket.halNo);
            if (hareket.isGiris) {
                dukkan.toplamGiris += hareket.kasaAdet;
                dukkan.kalanKasa += hareket.kasaAdet;
            } else {
                dukkan.toplamCikis += hareket.kasaAdet;
                dukkan.kalanKasa -= hareket.kasaAdet;
            }
            dukkan.rehinTutar += hareket.rehinTutar;
        });

        // Map'i diziye çevir ve sırala
        return Array.from(dukkanlar.values())
            .sort((a, b) => a.halNo.localeCompare(b.halNo));
    }
}</content>