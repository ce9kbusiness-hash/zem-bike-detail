// ===== Navbar Scroll =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile Menu =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== Active Nav Link =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const pos = window.scrollY + 100;
    sections.forEach(section => {
        if (pos >= section.offsetTop && pos < section.offsetTop + section.offsetHeight) {
            navLinks.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            const active = navLinks.querySelector(`a[href="#${section.id}"]`);
            if (active) active.classList.add('active');
        }
    });
});

// ===== Scroll Animations =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 100);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// ===== Counter Animation =====
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            const start = performance.now();
            function update(now) {
                const progress = Math.min((now - start) / 2000, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                entry.target.textContent = Math.round(eased * target);
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number[data-target]').forEach(c => counterObserver.observe(c));

// ===== Bike Search =====
const bikeData = [
    // Yamaha
    { brand: 'Yamaha', model: 'Y15ZR' }, { brand: 'Yamaha', model: 'Y16RC' }, { brand: 'Yamaha', model: 'LC135' },
    { brand: 'Yamaha', model: 'Lagenda 115Z' }, { brand: 'Yamaha', model: 'Lagenda 115ZR' }, { brand: 'Yamaha', model: 'Lagenda 110' },
    { brand: 'Yamaha', model: 'Jupiter Z1' }, { brand: 'Yamaha', model: 'Sniper 150' }, { brand: 'Yamaha', model: 'Exciter 150' },
    { brand: 'Yamaha', model: 'NVX' }, { brand: 'Yamaha', model: 'NMAX' }, { brand: 'Yamaha', model: 'XMAX' },
    { brand: 'Yamaha', model: 'Aerox 155' }, { brand: 'Yamaha', model: 'Mio M3' }, { brand: 'Yamaha', model: 'Mio Z' },
    { brand: 'Yamaha', model: 'Mio Gravis' }, { brand: 'Yamaha', model: 'Gear 125' }, { brand: 'Yamaha', model: 'Lexi' },
    { brand: 'Yamaha', model: 'QBIX' }, { brand: 'Yamaha', model: 'MT-15' }, { brand: 'Yamaha', model: 'MT-25' },
    { brand: 'Yamaha', model: 'MT-03' }, { brand: 'Yamaha', model: 'MT-07' }, { brand: 'Yamaha', model: 'MT-09' },
    { brand: 'Yamaha', model: 'MT-10' }, { brand: 'Yamaha', model: 'R15' }, { brand: 'Yamaha', model: 'R25' },
    { brand: 'Yamaha', model: 'YZF-R3' }, { brand: 'Yamaha', model: 'YZF-R1' }, { brand: 'Yamaha', model: 'YZF-R6' },
    { brand: 'Yamaha', model: 'FZ150i' }, { brand: 'Yamaha', model: 'FZ-S Fi' }, { brand: 'Yamaha', model: 'XSR155' },
    { brand: 'Yamaha', model: 'XSR700' }, { brand: 'Yamaha', model: 'XSR900' }, { brand: 'Yamaha', model: 'WR155R' },
    { brand: 'Yamaha', model: 'XTZ125' }, { brand: 'Yamaha', model: 'Tenere 700' }, { brand: 'Yamaha', model: 'Tracer 700' },
    { brand: 'Yamaha', model: 'Tracer 900' }, { brand: 'Yamaha', model: 'Tracer 9 GT' },
    // Honda
    { brand: 'Honda', model: 'EX5' }, { brand: 'Honda', model: 'Wave 110' }, { brand: 'Honda', model: 'Wave 125' },
    { brand: 'Honda', model: 'Wave Alpha' }, { brand: 'Honda', model: 'Dash 125' }, { brand: 'Honda', model: 'RS150R' },
    { brand: 'Honda', model: 'RS-X' }, { brand: 'Honda', model: 'CBR150R' }, { brand: 'Honda', model: 'CBR250RR' },
    { brand: 'Honda', model: 'CBR500R' }, { brand: 'Honda', model: 'CBR600RR' }, { brand: 'Honda', model: 'CBR650R' },
    { brand: 'Honda', model: 'CBR1000RR' }, { brand: 'Honda', model: 'CB150R' }, { brand: 'Honda', model: 'CB250R' },
    { brand: 'Honda', model: 'CB500F' }, { brand: 'Honda', model: 'CB500X' }, { brand: 'Honda', model: 'CB650R' },
    { brand: 'Honda', model: 'CB1000R' }, { brand: 'Honda', model: 'PCX160' }, { brand: 'Honda', model: 'Vario 125' },
    { brand: 'Honda', model: 'Vario 160' }, { brand: 'Honda', model: 'ADV150' }, { brand: 'Honda', model: 'ADV160' },
    { brand: 'Honda', model: 'X-ADV' }, { brand: 'Honda', model: 'BeAT' }, { brand: 'Honda', model: 'Scoopy' },
    { brand: 'Honda', model: 'Genio' }, { brand: 'Honda', model: 'Click 125i' }, { brand: 'Honda', model: 'Click 160' },
    { brand: 'Honda', model: 'Forza' }, { brand: 'Honda', model: 'Forza 350' }, { brand: 'Honda', model: 'Rebel 500' },
    { brand: 'Honda', model: 'CMX500' }, { brand: 'Honda', model: 'Africa Twin' }, { brand: 'Honda', model: 'CRF1100L' },
    { brand: 'Honda', model: 'CRF250L' }, { brand: 'Honda', model: 'CRF250Rally' }, { brand: 'Honda', model: 'CRF300L' },
    { brand: 'Honda', model: 'Gold Wing' }, { brand: 'Honda', model: 'ST125 (Dax)' }, { brand: 'Honda', model: 'MSX125 (Grom)' },
    { brand: 'Honda', model: 'Monkey' }, { brand: 'Honda', model: 'Super Cub C125' }, { brand: 'Honda', model: 'NT1100' },
    // Kawasaki
    { brand: 'Kawasaki', model: 'Ninja 250' }, { brand: 'Kawasaki', model: 'Ninja 400' }, { brand: 'Kawasaki', model: 'Ninja 650' },
    { brand: 'Kawasaki', model: 'Ninja ZX-6R' }, { brand: 'Kawasaki', model: 'Ninja ZX-10R' }, { brand: 'Kawasaki', model: 'Ninja ZX-14R' },
    { brand: 'Kawasaki', model: 'Ninja ZX-25R' }, { brand: 'Kawasaki', model: 'Ninja H2' }, { brand: 'Kawasaki', model: 'Z250' },
    { brand: 'Kawasaki', model: 'Z400' }, { brand: 'Kawasaki', model: 'Z650' }, { brand: 'Kawasaki', model: 'Z650RS' },
    { brand: 'Kawasaki', model: 'Z900' }, { brand: 'Kawasaki', model: 'Z900RS' }, { brand: 'Kawasaki', model: 'Z1000' },
    { brand: 'Kawasaki', model: 'Z H2' }, { brand: 'Kawasaki', model: 'Versys-X 300' }, { brand: 'Kawasaki', model: 'Versys 650' },
    { brand: 'Kawasaki', model: 'Versys 1000' }, { brand: 'Kawasaki', model: 'Vulcan S' }, { brand: 'Kawasaki', model: 'Vulcan 650' },
    { brand: 'Kawasaki', model: 'W175' }, { brand: 'Kawasaki', model: 'W800' }, { brand: 'Kawasaki', model: 'KLX150' },
    { brand: 'Kawasaki', model: 'KLX230' }, { brand: 'Kawasaki', model: 'KLX250' }, { brand: 'Kawasaki', model: 'KX250' },
    { brand: 'Kawasaki', model: 'KX450' }, { brand: 'Kawasaki', model: 'D-Tracker' }, { brand: 'Kawasaki', model: 'D-Tracker 150' },
    { brand: 'Kawasaki', model: 'KLR650' },
    // Suzuki
    { brand: 'Suzuki', model: 'Raider R150' }, { brand: 'Suzuki', model: 'Raider Fi' }, { brand: 'Suzuki', model: 'Satria F150' },
    { brand: 'Suzuki', model: 'GSX-R150' }, { brand: 'Suzuki', model: 'GSX-S150' }, { brand: 'Suzuki', model: 'GSX-R250' },
    { brand: 'Suzuki', model: 'GSX-250R' }, { brand: 'Suzuki', model: 'GSX-R1000' }, { brand: 'Suzuki', model: 'GSX-S750' },
    { brand: 'Suzuki', model: 'GSX-S1000' }, { brand: 'Suzuki', model: 'SV650' }, { brand: 'Suzuki', model: 'V-Strom 250' },
    { brand: 'Suzuki', model: 'V-Strom 650' }, { brand: 'Suzuki', model: 'V-Strom 1050' }, { brand: 'Suzuki', model: 'Hayabusa' },
    { brand: 'Suzuki', model: 'Intruder 150' }, { brand: 'Suzuki', model: 'Address' }, { brand: 'Suzuki', model: 'Nex' },
    { brand: 'Suzuki', model: 'Avenis' }, { brand: 'Suzuki', model: 'Burgman Street' }, { brand: 'Suzuki', model: 'RM-Z250' },
    { brand: 'Suzuki', model: 'DR-Z400' }, { brand: 'Suzuki', model: 'Katana' },
    // Ducati
    { brand: 'Ducati', model: 'Panigale V2' }, { brand: 'Ducati', model: 'Panigale V4' },
    { brand: 'Ducati', model: 'Streetfighter V2' }, { brand: 'Ducati', model: 'Streetfighter V4' },
    { brand: 'Ducati', model: 'Monster' }, { brand: 'Ducati', model: 'Monster 821' }, { brand: 'Ducati', model: 'Monster 937' },
    { brand: 'Ducati', model: 'Scrambler Icon' }, { brand: 'Ducati', model: 'Scrambler Desert Sled' },
    { brand: 'Ducati', model: 'Scrambler Nightshift' }, { brand: 'Ducati', model: 'Scrambler 800' },
    { brand: 'Ducati', model: 'Multistrada V2' }, { brand: 'Ducati', model: 'Multistrada V4' },
    { brand: 'Ducati', model: 'Multistrada 950' }, { brand: 'Ducati', model: 'Diavel' }, { brand: 'Ducati', model: 'XDiavel' },
    { brand: 'Ducati', model: 'Hypermotard 950' }, { brand: 'Ducati', model: 'DesertX' }, { brand: 'Ducati', model: 'SuperSport 950' },
    // BMW
    { brand: 'BMW', model: 'G 310 R' }, { brand: 'BMW', model: 'G 310 GS' }, { brand: 'BMW', model: 'G 310 RR' },
    { brand: 'BMW', model: 'F 900 R' }, { brand: 'BMW', model: 'F 900 XR' }, { brand: 'BMW', model: 'F 850 GS' },
    { brand: 'BMW', model: 'F 750 GS' }, { brand: 'BMW', model: 'R nineT' }, { brand: 'BMW', model: 'R nineT Scrambler' },
    { brand: 'BMW', model: 'R 1250 GS' }, { brand: 'BMW', model: 'R 1250 RT' }, { brand: 'BMW', model: 'R 1250 R' },
    { brand: 'BMW', model: 'R 18' }, { brand: 'BMW', model: 'S 1000 RR' }, { brand: 'BMW', model: 'S 1000 XR' },
    { brand: 'BMW', model: 'M 1000 RR' }, { brand: 'BMW', model: 'K 1600 GT' }, { brand: 'BMW', model: 'K 1600 GTL' },
    { brand: 'BMW', model: 'C 400 X' }, { brand: 'BMW', model: 'C 400 GT' }, { brand: 'BMW', model: 'C 650 GT' },
    { brand: 'BMW', model: 'CE 04' },
    // Triumph
    { brand: 'Triumph', model: 'Street Triple' }, { brand: 'Triumph', model: 'Street Triple R' },
    { brand: 'Triumph', model: 'Street Triple RS' }, { brand: 'Triumph', model: 'Speed Triple 1200' },
    { brand: 'Triumph', model: 'Trident 660' }, { brand: 'Triumph', model: 'Tiger 660' },
    { brand: 'Triumph', model: 'Tiger 900' }, { brand: 'Triumph', model: 'Tiger 1200' },
    { brand: 'Triumph', model: 'Bonneville T100' }, { brand: 'Triumph', model: 'Bonneville T120' },
    { brand: 'Triumph', model: 'Bonneville Bobber' }, { brand: 'Triumph', model: 'Bonneville Speedmaster' },
    { brand: 'Triumph', model: 'Scrambler 900' }, { brand: 'Triumph', model: 'Scrambler 1200' },
    { brand: 'Triumph', model: 'Thruxton RS' }, { brand: 'Triumph', model: 'Rocket 3' },
    { brand: 'Triumph', model: 'Speed 400' }, { brand: 'Triumph', model: 'Scrambler 400 X' },
    // KTM
    { brand: 'KTM', model: 'Duke 125' }, { brand: 'KTM', model: 'Duke 200' }, { brand: 'KTM', model: 'Duke 250' },
    { brand: 'KTM', model: 'Duke 390' }, { brand: 'KTM', model: 'Duke 790' }, { brand: 'KTM', model: 'Duke 890' },
    { brand: 'KTM', model: 'Duke 1290' }, { brand: 'KTM', model: 'RC 125' }, { brand: 'KTM', model: 'RC 200' },
    { brand: 'KTM', model: 'RC 390' }, { brand: 'KTM', model: 'Adventure 250' }, { brand: 'KTM', model: 'Adventure 390' },
    { brand: 'KTM', model: 'Adventure 890' }, { brand: 'KTM', model: 'Adventure 1290' },
    { brand: 'KTM', model: 'EXC 250' }, { brand: 'KTM', model: 'EXC 300' },
    { brand: 'KTM', model: 'SX 125' }, { brand: 'KTM', model: 'SX 250' }, { brand: 'KTM', model: 'SX 450' },
    { brand: 'KTM', model: '690 Enduro R' }, { brand: 'KTM', model: '890 Duke R' }, { brand: 'KTM', model: '890 Adventure' },
    { brand: 'KTM', model: '1290 Super Duke R' }, { brand: 'KTM', model: '1290 Super Adventure' },
    // Aprilia
    { brand: 'Aprilia', model: 'RS 125' }, { brand: 'Aprilia', model: 'RS 150' }, { brand: 'Aprilia', model: 'RS 660' },
    { brand: 'Aprilia', model: 'RSV4' }, { brand: 'Aprilia', model: 'Tuono 660' }, { brand: 'Aprilia', model: 'Tuono V4' },
    { brand: 'Aprilia', model: 'Tuareg 660' }, { brand: 'Aprilia', model: 'SR GT 125' }, { brand: 'Aprilia', model: 'SR GT 160' },
    { brand: 'Aprilia', model: 'SR GT 200' }, { brand: 'Aprilia', model: 'SXR 160' },
    // Benelli
    { brand: 'Benelli', model: 'TNT 135' }, { brand: 'Benelli', model: 'TNT 250' }, { brand: 'Benelli', model: 'TNT 300' },
    { brand: 'Benelli', model: 'TNT 600' }, { brand: 'Benelli', model: '302R' }, { brand: 'Benelli', model: '302S' },
    { brand: 'Benelli', model: 'Leoncino 250' }, { brand: 'Benelli', model: 'Leoncino 500' },
    { brand: 'Benelli', model: 'TRK 251' }, { brand: 'Benelli', model: 'TRK 502' },
    { brand: 'Benelli', model: '502C' }, { brand: 'Benelli', model: 'Imperiale 400' },
    // CFMoto
    { brand: 'CFMoto', model: '250NK' }, { brand: 'CFMoto', model: '300NK' }, { brand: 'CFMoto', model: '300SR' },
    { brand: 'CFMoto', model: '450NK' }, { brand: 'CFMoto', model: '450SR' }, { brand: 'CFMoto', model: '450MT' },
    { brand: 'CFMoto', model: '650NK' }, { brand: 'CFMoto', model: '650MT' },
    { brand: 'CFMoto', model: '700CL-X' }, { brand: 'CFMoto', model: '800MT' },
    // Modenas
    { brand: 'Modenas', model: 'Kriss 110' }, { brand: 'Modenas', model: 'Kriss MR' }, { brand: 'Modenas', model: 'Kriss MR2' },
    { brand: 'Modenas', model: 'Karisma 125' }, { brand: 'Modenas', model: 'Pulsar NS160' },
    { brand: 'Modenas', model: 'Pulsar NS200' }, { brand: 'Modenas', model: 'Pulsar RS200' },
    { brand: 'Modenas', model: 'Dominar D400' }, { brand: 'Modenas', model: 'V15' },
    { brand: 'Modenas', model: 'Elegan 250' }, { brand: 'Modenas', model: 'CT 110' },
    // Honda (additional Malaysia-specific)
    { brand: 'Honda', model: 'Wave Dash' }, { brand: 'Honda', model: 'Future 125' },
    { brand: 'Honda', model: 'CB150X' }, { brand: 'Honda', model: 'CBR1000RR-R' },
    // Yamaha (additional)
    { brand: 'Yamaha', model: 'YZF-R15' }, { brand: 'Yamaha', model: 'YZF-R25' },
    { brand: 'Yamaha', model: 'MT-15 (2024)' }, { brand: 'Yamaha', model: 'NMAX Connected' },
    { brand: 'Yamaha', model: 'XMAX 300' },
    // Kawasaki (additional)
    { brand: 'Kawasaki', model: 'Ninja 400 (2024)' }, { brand: 'Kawasaki', model: 'Z900SE' },
    // Ducati (additional)
    { brand: 'Ducati', model: 'Panigale V4S' }, { brand: 'Ducati', model: 'Panigale V4 SP2' },
    { brand: 'Ducati', model: 'Streetfighter V4S' }, { brand: 'Ducati', model: 'Multistrada V4 Rally' },
    { brand: 'Ducati', model: 'Desert X Rally' },
    // BMW (additional)
    { brand: 'BMW', model: 'R 1300 GS' }, { brand: 'BMW', model: 'S 1000 RR (2024)' },
    // Triumph (additional)
    { brand: 'Triumph', model: 'Daytona 660' }, { brand: 'Triumph', model: 'Tiger Sport 660' },
    // KTM (additional)
    { brand: 'KTM', model: 'RC 8C' }, { brand: 'KTM', model: '1390 Super Duke R' },
    // MV Agusta
    { brand: 'MV Agusta', model: 'Brutale 800' }, { brand: 'MV Agusta', model: 'F3 800' },
    { brand: 'MV Agusta', model: 'Dragster 800' }, { brand: 'MV Agusta', model: 'Turismo Veloce' },
    // Royal Enfield
    { brand: 'Royal Enfield', model: 'Classic 350' }, { brand: 'Royal Enfield', model: 'Meteor 350' },
    { brand: 'Royal Enfield', model: 'Himalayan' }, { brand: 'Royal Enfield', model: 'Hunter 350' },
    { brand: 'Royal Enfield', model: 'Continental GT 650' }, { brand: 'Royal Enfield', model: 'Interceptor 650' },
    // Harley-Davidson
    { brand: 'Harley-Davidson', model: 'Iron 883' }, { brand: 'Harley-Davidson', model: 'Forty-Eight' },
    { brand: 'Harley-Davidson', model: 'Street Bob' }, { brand: 'Harley-Davidson', model: 'Fat Bob' },
    { brand: 'Harley-Davidson', model: 'Low Rider S' }, { brand: 'Harley-Davidson', model: 'Sportster S' },
    { brand: 'Harley-Davidson', model: 'Pan America 1250' },
    // Husqvarna
    { brand: 'Husqvarna', model: 'Svartpilen 200' }, { brand: 'Husqvarna', model: 'Svartpilen 401' },
    { brand: 'Husqvarna', model: 'Vitpilen 401' }, { brand: 'Husqvarna', model: 'Norden 901' },
    // Zontes
    { brand: 'Zontes', model: '310R' }, { brand: 'Zontes', model: '310X' }, { brand: 'Zontes', model: '310T' },
    { brand: 'Zontes', model: '350D' }, { brand: 'Zontes', model: '350T' },
    // QJ Motor
    { brand: 'QJ Motor', model: 'SRK 400' }, { brand: 'QJ Motor', model: 'SRV 400' },
    { brand: 'QJ Motor', model: 'SRC 500' },
    // WMoto
    { brand: 'WMoto', model: 'RT3' }, { brand: 'WMoto', model: 'Cubi Max' },
    // SYM
    { brand: 'SYM', model: 'Jet X 150' }, { brand: 'SYM', model: 'Maxsym 400' },
    { brand: 'SYM', model: 'Cruisym 150' },
    // Kymco
    { brand: 'Kymco', model: 'Downtown 250' }, { brand: 'Kymco', model: 'Xciting 400' },
    { brand: 'Kymco', model: 'AK550' },
    // GPX
    { brand: 'GPX', model: 'Demon 150' }, { brand: 'GPX', model: 'Legend 200' },
    { brand: 'GPX', model: 'Drone 150' }, { brand: 'GPX', model: 'FSE 200' },
];

let selectedBike = '';

function initBikeSearch() {
    const input = document.getElementById('bikeSearchInput');
    const dropdown = document.getElementById('bikeDropdown');
    const hiddenInput = document.getElementById('custBike');

    function renderDropdown(filter = '') {
        dropdown.innerHTML = '';
        const lowerFilter = filter.toLowerCase();
        let lastBrand = '';
        let count = 0;

        for (const bike of bikeData) {
            const fullText = `${bike.brand} ${bike.model}`;
            if (lowerFilter && !fullText.toLowerCase().includes(lowerFilter)) continue;

            if (bike.brand !== lastBrand) {
                const label = document.createElement('div');
                label.className = 'bike-group-label';
                label.textContent = bike.brand;
                dropdown.appendChild(label);
                lastBrand = bike.brand;
            }

            const opt = document.createElement('div');
            opt.className = 'bike-option';
            if (selectedBike === fullText) opt.classList.add('selected');
            opt.innerHTML = `<span class="bike-brand">${bike.brand}</span> ${bike.model}`;
            opt.addEventListener('click', () => {
                input.value = fullText;
                hiddenInput.value = fullText;
                selectedBike = fullText;
                dropdown.classList.remove('open');
                input.blur();
            });
            dropdown.appendChild(opt);
            count++;
        }

        if (count === 0) {
            const noResult = document.createElement('div');
            noResult.className = 'bike-option';
            noResult.style.color = 'var(--gray)';
            noResult.textContent = currentLang === 'ms' ? 'Tiada hasil dijumpai' : 'No results found';
            dropdown.appendChild(noResult);
        }
    }

    input.addEventListener('focus', () => {
        renderDropdown(input.value);
        dropdown.classList.add('open');
    });

    input.addEventListener('input', () => {
        hiddenInput.value = '';
        selectedBike = '';
        renderDropdown(input.value);
        dropdown.classList.add('open');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.bike-search')) {
            dropdown.classList.remove('open');
        }
    });
}

initBikeSearch();

// ===== Language System =====
const translations = {
    en: {
        nav_home: 'Home',
        nav_services: 'Services',
        nav_reviews: 'Reviews',
        nav_about: 'About',
        nav_contact: 'Contact',
        nav_book: 'Book Now',
        hero_badge: 'Powered by IGL Products',
        hero_title_1: 'Premium',
        hero_title_2: 'Bike Detailing',
        hero_title_3: 'That Turns Heads',
        hero_subtitle: 'ZEM Bike Detail delivers professional motorbike detailing services using exclusive IGL Products. From a quick wash to full ceramic coating — we make your ride shine.',
        hero_cta: 'Book Your Slot',
        hero_cta2: 'View Services',
        stat_bikes: 'Bikes Detailed',
        stat_igl: 'IGL Products',
        stat_rating: 'Customer Rating',
        scroll: 'Scroll',
        services_tag: 'Our Services',
        services_title_1: 'Choose Your',
        services_title_2: 'Package',
        services_desc: 'Every service uses premium IGL Products for the best care and protection for your bike.',
        svc_basic_name: 'Basic Wash',
        svc_basic_desc: 'A thorough exterior wash using IGL shampoo to remove dirt and grime, leaving your bike spotless.',
        svc_basic_f1: 'IGL Shampoo Wash',
        svc_basic_f2: 'Chain Cleaning',
        svc_basic_f3: 'Tire Shine',
        svc_premium_name: 'Premium Wash',
        svc_premium_desc: 'Upgraded wash with IGL pre-wash foam, detailed cleaning of all surfaces, and quick spray sealant.',
        svc_premium_f1: 'IGL Pre-Wash Foam',
        svc_premium_f2: 'Deep Clean',
        svc_premium_f3: 'Spray Sealant',
        svc_king_name: 'King Wash',
        svc_king_desc: 'The ultimate wash package. Full IGL treatment with foam cannon, hand wash, wax protection, and detail spray.',
        svc_king_f1: 'IGL Foam Cannon',
        svc_king_f2: 'Hand Wax',
        svc_king_f3: 'Detail Spray',
        svc_king_f4: 'Engine Bay Clean',
        svc_polish_name: 'Premium Polish',
        svc_polish_desc: 'Machine polishing with IGL polish compounds to remove swirl marks, scratches, and restore paint clarity.',
        svc_polish_f1: 'IGL Polish Compounds',
        svc_polish_f2: 'Swirl Removal',
        svc_polish_f3: 'Paint Correction',
        svc_polish_f4: 'Gloss Enhancement',
        svc_coating_name: 'Coating',
        svc_coating_desc: 'Professional IGL ceramic coating application for long-lasting protection, hydrophobic finish, and deep gloss.',
        svc_coating_f1: 'IGL Ceramic Coating',
        svc_coating_f2: 'Hydrophobic Shield',
        svc_coating_f3: 'UV Protection',
        svc_coating_f4: '12+ Month Durability',
        book_now: 'Book Now',
        popular: 'Popular',
        reviews_tag: 'Customer Reviews',
        reviews_title_1: 'What Our',
        reviews_title_2: 'Riders',
        reviews_title_3: 'Say',
        reviews_desc: 'Real feedback from riders who trusted us with their bikes.',
        review_1_text: '"Amazing service! My Y15ZR looks brand new after the King Wash. The foam cannon treatment really makes a difference. Will definitely come back!"',
        review_1_svc: 'King Wash',
        review_2_text: '"The ceramic coating is worth every ringgit. It\'s been 3 months and water still beads off like day one. Professional team and great results."',
        review_2_svc: 'Coating',
        review_3_text: '"Sent my Ninja 250 for paint correction and polish. The swirl marks are completely gone and the gloss is incredible. Highly recommended!"',
        review_3_svc: 'Premium Polish',
        review_4_text: '"Quick and thorough basic wash. The chain cleaning was very detailed and the tire shine lasted for weeks. Great value for RM29!"',
        review_4_svc: 'Basic Wash',
        review_5_text: '"The premium wash with spray sealant is my go-to every month. My V-Strom always looks showroom ready after their treatment. Top notch!"',
        review_5_svc: 'Premium Wash',
        review_6_text: '"Brought my Duke 390 for full coating before a long ride to Terengganu. The protection held up through rain and highway bugs. Best investment for my bike!"',
        review_6_svc: 'Coating',
        about_tag: 'About Us',
        about_title_1: 'Why Choose',
        about_desc: 'We treat every bike like our own. Premium products, professional results.',
        about_1_title: 'IGL Certified Products',
        about_1_desc: 'We exclusively use IGL Products across all services — from shampoo to ceramic coating — ensuring consistent premium quality and protection for your bike.',
        about_2_title: 'Attention to Detail',
        about_2_desc: 'Every corner, every bolt, every panel — we don\'t miss a spot. Our detailing process is thorough and methodical for flawless results every time.',
        about_3_title: 'Trusted by Riders',
        about_3_desc: 'Over 1,000 bikes detailed and counting. Our customers keep coming back because we deliver consistent, showroom-quality results.',
        contact_title: 'Get in Touch',
        contact_desc: 'Have questions or want to discuss a custom package? Reach out to us.',
        contact_location: 'Location',
        contact_location_value: 'Gong Badak, Terengganu',
        contact_cta_title: 'Ready to Book?',
        contact_cta_desc: 'Schedule your bike detailing appointment online in just a few clicks.',
        footer_copy: '\u00a9 2026 ZEM Bike Detail. All rights reserved. Powered by IGL Products.',
        modal_title: 'Book Your Service',
        step1_title: 'Select a Service',
        step2_title: 'Pick Date & Time',
        step3_title: 'Your Details',
        step4_title: 'Review Your Booking',
        date_label: 'Date',
        time_label: 'Time Slot',
        name_label: 'Full Name *',
        phone_label: 'Phone Number *',
        email_label: 'Email',
        bike_label: 'Bike Model *',
        bike_placeholder: '-- Select your bike --',
        notes_label: 'Notes (optional)',
        next: 'Next',
        back: 'Back',
        review_btn: 'Review',
        review_service: 'Service',
        review_price: 'Price',
        review_date: 'Date',
        review_time: 'Time',
        review_name: 'Name',
        review_phone: 'Phone',
        review_bike: 'Bike',
        confirm: 'Confirm Booking',
        success_title: 'Booking Confirmed!',
        success_desc: 'We\'ll contact you shortly to confirm your appointment. Thank you for choosing ZEM Bike Detail!',
        done: 'Done',
        cal_sun: 'Sun',
        cal_mon: 'Mon',
        cal_tue: 'Tue',
        cal_wed: 'Wed',
        cal_thu: 'Thu',
        cal_fri: 'Fri',
        cal_sat: 'Sat',
        alert_select_service: 'Please select a service',
        alert_select_date: 'Please select a date',
        alert_select_time: 'Please select a time slot',
        alert_fill_fields: 'Please fill in all required fields',
        alert_error: 'Something went wrong. Please try again.',
        alert_connection: 'Could not connect to server. Please try again later.'
    },
    ms: {
        nav_home: 'Utama',
        nav_services: 'Perkhidmatan',
        nav_reviews: 'Ulasan',
        nav_about: 'Tentang',
        nav_contact: 'Hubungi',
        nav_book: 'Tempah Sekarang',
        hero_badge: 'Dikuasakan oleh Produk IGL',
        hero_title_1: 'Premium',
        hero_title_2: 'Detailing Motosikal',
        hero_title_3: 'Yang Menarik Perhatian',
        hero_subtitle: 'ZEM Bike Detail menyediakan perkhidmatan detailing motosikal profesional menggunakan Produk IGL eksklusif. Dari basuhan ringan hingga salutan seramik penuh — kami buat motosikal anda bersinar.',
        hero_cta: 'Tempah Slot Anda',
        hero_cta2: 'Lihat Perkhidmatan',
        stat_bikes: 'Motosikal Didetail',
        stat_igl: 'Produk IGL',
        stat_rating: 'Penilaian Pelanggan',
        scroll: 'Tatal',
        services_tag: 'Perkhidmatan Kami',
        services_title_1: 'Pilih',
        services_title_2: 'Pakej Anda',
        services_desc: 'Setiap perkhidmatan menggunakan Produk IGL premium untuk penjagaan dan perlindungan terbaik untuk motosikal anda.',
        svc_basic_name: 'Basuhan Asas',
        svc_basic_desc: 'Basuhan luaran menyeluruh menggunakan syampu IGL untuk menghilangkan kotoran, meninggalkan motosikal anda bersih.',
        svc_basic_f1: 'Basuhan Syampu IGL',
        svc_basic_f2: 'Pembersihan Rantai',
        svc_basic_f3: 'Kilat Tayar',
        svc_premium_name: 'Basuhan Premium',
        svc_premium_desc: 'Basuhan dinaik taraf dengan buih pra-basuh IGL, pembersihan mendalam semua permukaan, dan pengilat semburan.',
        svc_premium_f1: 'Buih Pra-Basuh IGL',
        svc_premium_f2: 'Pembersihan Mendalam',
        svc_premium_f3: 'Pengilat Semburan',
        svc_king_name: 'Basuhan King',
        svc_king_desc: 'Pakej basuhan terbaik. Rawatan IGL penuh dengan meriam buih, basuhan tangan, perlindungan lilin, dan semburan detail.',
        svc_king_f1: 'Meriam Buih IGL',
        svc_king_f2: 'Lilin Tangan',
        svc_king_f3: 'Semburan Detail',
        svc_king_f4: 'Pembersihan Ruang Enjin',
        svc_polish_name: 'Kilat Premium',
        svc_polish_desc: 'Kilat mesin dengan sebatian kilat IGL untuk menghilangkan tanda pusaran, calar, dan memulihkan kejelasan cat.',
        svc_polish_f1: 'Sebatian Kilat IGL',
        svc_polish_f2: 'Penghapusan Pusaran',
        svc_polish_f3: 'Pembetulan Cat',
        svc_polish_f4: 'Peningkatan Kilauan',
        svc_coating_name: 'Salutan',
        svc_coating_desc: 'Aplikasi salutan seramik IGL profesional untuk perlindungan tahan lama, kemasan hidrofobik, dan kilauan mendalam.',
        svc_coating_f1: 'Salutan Seramik IGL',
        svc_coating_f2: 'Perisai Hidrofobik',
        svc_coating_f3: 'Perlindungan UV',
        svc_coating_f4: 'Ketahanan 12+ Bulan',
        book_now: 'Tempah Sekarang',
        popular: 'Popular',
        reviews_tag: 'Ulasan Pelanggan',
        reviews_title_1: 'Apa Kata',
        reviews_title_2: 'Penunggang',
        reviews_title_3: 'Kami',
        reviews_desc: 'Maklum balas sebenar dari penunggang yang mempercayai kami dengan motosikal mereka.',
        review_1_text: '"Perkhidmatan yang menakjubkan! Y15ZR saya kelihatan baru selepas Basuhan King. Rawatan meriam buih benar-benar membuat perbezaan. Pasti akan kembali!"',
        review_1_svc: 'Basuhan King',
        review_2_text: '"Salutan seramik berbaloi setiap ringgit. Sudah 3 bulan dan air masih berbiji seperti hari pertama. Pasukan profesional dan hasil yang hebat."',
        review_2_svc: 'Salutan',
        review_3_text: '"Hantar Ninja 250 saya untuk pembetulan cat dan kilat. Tanda pusaran hilang sepenuhnya dan kilauan luar biasa. Sangat disyorkan!"',
        review_3_svc: 'Kilat Premium',
        review_4_text: '"Basuhan asas yang cepat dan menyeluruh. Pembersihan rantai sangat terperinci dan kilat tayar bertahan berminggu-minggu. Berbaloi untuk RM49!"',
        review_4_svc: 'Basuhan Asas',
        review_5_text: '"Basuhan premium dengan pengilat semburan adalah pilihan saya setiap bulan. V-Strom saya sentiasa sedia pameran selepas rawatan mereka. Terbaik!"',
        review_5_svc: 'Basuhan Premium',
        review_6_text: '"Bawa Duke 390 saya untuk salutan penuh sebelum perjalanan jauh ke Terengganu. Perlindungan bertahan melalui hujan dan serangga lebuh raya. Pelaburan terbaik untuk motosikal saya!"',
        review_6_svc: 'Salutan',
        about_tag: 'Tentang Kami',
        about_title_1: 'Mengapa Pilih',
        about_desc: 'Kami merawat setiap motosikal seperti milik kami sendiri. Produk premium, hasil profesional.',
        about_1_title: 'Produk Bersijil IGL',
        about_1_desc: 'Kami secara eksklusif menggunakan Produk IGL dalam semua perkhidmatan — dari syampu hingga salutan seramik — memastikan kualiti premium yang konsisten dan perlindungan untuk motosikal anda.',
        about_2_title: 'Perhatian terhadap Detail',
        about_2_desc: 'Setiap sudut, setiap bolt, setiap panel — kami tidak terlepas satu titik pun. Proses detailing kami menyeluruh dan metodikal untuk hasil yang sempurna setiap kali.',
        about_3_title: 'Dipercayai oleh Penunggang',
        about_3_desc: 'Lebih 1,000 motosikal didetail dan terus bertambah. Pelanggan kami terus kembali kerana kami memberikan hasil yang konsisten, berkualiti pameran.',
        contact_title: 'Hubungi Kami',
        contact_desc: 'Ada soalan atau ingin bincang pakej khas? Hubungi kami.',
        contact_location: 'Lokasi',
        contact_location_value: 'Gong Badak, Terengganu',
        contact_cta_title: 'Sedia untuk Tempah?',
        contact_cta_desc: 'Jadualkan temujanji detailing motosikal anda secara online dalam beberapa klik sahaja.',
        footer_copy: '\u00a9 2026 ZEM Bike Detail. Hak cipta terpelihara. Dikuasakan oleh Produk IGL.',
        modal_title: 'Tempah Perkhidmatan Anda',
        step1_title: 'Pilih Perkhidmatan',
        step2_title: 'Pilih Tarikh & Masa',
        step3_title: 'Butiran Anda',
        step4_title: 'Semak Tempahan Anda',
        date_label: 'Tarikh',
        time_label: 'Slot Masa',
        name_label: 'Nama Penuh *',
        phone_label: 'Nombor Telefon *',
        email_label: 'E-mel',
        bike_label: 'Model Motosikal *',
        bike_placeholder: '-- Pilih motosikal anda --',
        notes_label: 'Nota (pilihan)',
        next: 'Seterusnya',
        back: 'Kembali',
        review_btn: 'Semak',
        review_service: 'Perkhidmatan',
        review_price: 'Harga',
        review_date: 'Tarikh',
        review_time: 'Masa',
        review_name: 'Nama',
        review_phone: 'Telefon',
        review_bike: 'Motosikal',
        confirm: 'Sahkan Tempahan',
        success_title: 'Tempahan Disahkan!',
        success_desc: 'Kami akan menghubungi anda sebentar lagi untuk mengesahkan temujanji anda. Terima kasih kerana memilih ZEM Bike Detail!',
        done: 'Selesai',
        cal_sun: 'Ahd',
        cal_mon: 'Isn',
        cal_tue: 'Sel',
        cal_wed: 'Rab',
        cal_thu: 'Kha',
        cal_fri: 'Jum',
        cal_sat: 'Sab',
        alert_select_service: 'Sila pilih perkhidmatan',
        alert_select_date: 'Sila pilih tarikh',
        alert_select_time: 'Sila pilih slot masa',
        alert_fill_fields: 'Sila isi semua medan yang diperlukan',
        alert_error: 'Sesuatu telah berlaku. Sila cuba lagi.',
        alert_connection: 'Tidak dapat menyambung ke pelayan. Sila cuba lagi kemudian.'
    }
};

let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang === 'ms' ? 'ms' : 'en';
    const t = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key] !== undefined) {
            el.textContent = t[key];
        }
    });

    // Update lang toggle button text
    document.getElementById('langToggle').querySelector('.lang-flag').textContent = lang === 'en' ? 'EN' : 'BM';

    // Update placeholders
    const nameInput = document.getElementById('custName');
    const phoneInput = document.getElementById('custPhone');
    const emailInput = document.getElementById('custEmail');
    const notesInput = document.getElementById('custNotes');
    const bikeInput = document.getElementById('bikeSearchInput');
    if (lang === 'ms') {
        nameInput.placeholder = 'Ahmad bin Ali';
        phoneInput.placeholder = '+60 12-345 6789';
        emailInput.placeholder = 'ahmad@email.com';
        notesInput.placeholder = 'Sebarang permintaan khas...';
        bikeInput.placeholder = 'Cari model motosikal...';
    } else {
        nameInput.placeholder = 'Ahmad bin Ali';
        phoneInput.placeholder = '+60 12-345 6789';
        emailInput.placeholder = 'ahmad@email.com';
        notesInput.placeholder = 'Any special requests...';
        bikeInput.placeholder = 'Search bike model...';
    }

    // Save preference
    localStorage.setItem('zem-lang', lang);
}

document.getElementById('langToggle').addEventListener('click', () => {
    setLanguage(currentLang === 'en' ? 'ms' : 'en');
});

// Load saved language preference
const savedLang = localStorage.getItem('zem-lang');
if (savedLang && translations[savedLang]) {
    setLanguage(savedLang);
}

// ===== Custom Calendar =====
let calendarDate = new Date();
let selectedDate = null;

function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthNames = {
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        ms: ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember']
    };

    document.getElementById('calMonthYear').textContent = `${monthNames[currentLang][month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const container = document.getElementById('calDays');
    container.innerHTML = '';

    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('button');
        empty.type = 'button';
        empty.className = 'calendar-day empty';
        container.appendChild(empty);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'calendar-day';
        btn.textContent = day;

        const cellDate = new Date(year, month, day);
        cellDate.setHours(0, 0, 0, 0);

        if (cellDate < today) {
            btn.classList.add('disabled');
        } else {
            btn.addEventListener('click', () => selectDate(cellDate, btn));
        }

        if (cellDate.getTime() === today.getTime()) {
            btn.classList.add('today');
        }

        if (selectedDate && cellDate.getTime() === selectedDate.getTime()) {
            btn.classList.add('selected');
        }

        container.appendChild(btn);
    }
}

function selectDate(date, btn) {
    selectedDate = date;
    document.getElementById('bookingDate').value = date.toISOString().split('T')[0];

    // Update visual selection
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    btn.classList.add('selected');
}

document.getElementById('calPrev').addEventListener('click', () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('calNext').addEventListener('click', () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
});

// ===== Booking Modal =====
let currentStep = 1;
let selectedService = '';
let selectedPrice = 0;

function openBookingModal(service, price) {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (service) {
        selectedService = service;
        selectedPrice = price;
        const radio = document.querySelector(`input[name="service"][value="${service}"]`);
        if (radio) radio.checked = true;
    }

    // Reset and render calendar
    selectedDate = null;
    calendarDate = new Date();
    renderCalendar();

    goToStep(1);
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
    goToStep(1);
    // Reset form
    document.querySelectorAll('.modal input[type="radio"]').forEach(r => r.checked = false);
    document.querySelectorAll('.modal input[type="text"], .modal input[type="tel"], .modal input[type="email"], .modal textarea').forEach(i => i.value = '');
    document.getElementById('custBike').value = '';
    document.getElementById('bikeSearchInput').value = '';
    document.getElementById('bookingDate').value = '';
    selectedDate = null;
    selectedBike = '';
}

function goToStep(step) {
    currentStep = step;
    document.querySelectorAll('.modal-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');

    // Update step indicators
    document.querySelectorAll('.step-dot').forEach(dot => {
        const dotStep = parseInt(dot.dataset.step);
        dot.classList.remove('active', 'done');
        if (dotStep === step) dot.classList.add('active');
        else if (dotStep < step) dot.classList.add('done');
    });
}

function nextStep(step) {
    const t = translations[currentLang];

    // Validate current step
    if (currentStep === 1) {
        const selected = document.querySelector('input[name="service"]:checked');
        if (!selected) {
            alert(t.alert_select_service);
            return;
        }
        selectedService = selected.value;
        selectedPrice = parseInt(selected.dataset.price);
    }

    if (currentStep === 2) {
        const date = document.getElementById('bookingDate').value;
        const time = document.querySelector('input[name="time"]:checked');
        if (!date) {
            alert(t.alert_select_date);
            return;
        }
        if (!time) {
            alert(t.alert_select_time);
            return;
        }
    }

    if (currentStep === 3) {
        const name = document.getElementById('custName').value.trim();
        const phone = document.getElementById('custPhone').value.trim();
        const bike = document.getElementById('custBike').value;
        if (!name || !phone || !bike) {
            alert(t.alert_fill_fields);
            return;
        }
    }

    // If going to review step, populate summary
    if (step === 4) {
        populateReview();
    }

    goToStep(step);
}

function prevStep(step) {
    goToStep(step);
}

function populateReview() {
    const date = document.getElementById('bookingDate').value;
    const time = document.querySelector('input[name="time"]:checked');
    document.getElementById('reviewService').textContent = selectedService;
    document.getElementById('reviewPrice').textContent = `RM${selectedPrice}`;
    document.getElementById('reviewDate').textContent = date ? new Date(date + 'T00:00:00').toLocaleDateString(currentLang === 'ms' ? 'ms-MY' : 'en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-';
    document.getElementById('reviewTime').textContent = time ? formatTime(time.value) : '-';
    document.getElementById('reviewName').textContent = document.getElementById('custName').value || '-';
    document.getElementById('reviewPhone').textContent = document.getElementById('custPhone').value || '-';
    document.getElementById('reviewBike').textContent = document.getElementById('bikeSearchInput').value || '-';
}

function formatTime(time24) {
    const [h, m] = time24.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${h12}:${m} ${ampm}`;
}

async function submitBooking() {
    const t = translations[currentLang];

    const booking = {
        service: selectedService,
        price: selectedPrice,
        date: document.getElementById('bookingDate').value,
        time: document.querySelector('input[name="time"]:checked')?.value,
        name: document.getElementById('custName').value.trim(),
        phone: document.getElementById('custPhone').value.trim(),
        email: document.getElementById('custEmail').value.trim(),
        bike: document.getElementById('custBike').value,
        notes: document.getElementById('custNotes').value.trim(),
        createdAt: new Date().toISOString()
    };

    try {
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(booking)
        });

        if (res.ok) {
            document.querySelectorAll('.modal-step').forEach(s => s.classList.remove('active'));
            document.getElementById('stepSuccess').classList.add('active');
        } else {
            alert(t.alert_error);
        }
    } catch (err) {
        alert(t.alert_connection);
    }
}

// Close modal on overlay click
document.getElementById('bookingModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeBookingModal();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBookingModal();
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
