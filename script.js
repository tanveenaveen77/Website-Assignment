const wasteForm = document.getElementById("wasteForm");
const wasteName = document.getElementById("wasteName");
const wasteCategory = document.getElementById("wasteCategory");
const wasteLocation = document.getElementById("wasteLocation");
const wasteImage = document.getElementById("wasteImage");
const imagePreview = document.getElementById("imagePreview");
const adviceBox = document.getElementById("adviceBox");
const reportList = document.getElementById("reportList");

let reports = [];

const disposalAdvice = {
    Plastic: {
        icon: "♻️",
        title: "Plastic waste",
        text: "Check the local recycling rules. Empty and rinse recyclable plastic containers where appropriate."
    },
    Paper: {
        icon: "📄",
        title: "Paper waste",
        text: "Keep clean, dry paper separate. Paper contaminated with food or grease may not be recyclable."
    },
    Metal: {
        icon: "🥫",
        title: "Metal waste",
        text: "Separate accepted metal cans and containers. Follow local collection guidance."
    },
    Organic: {
        icon: "🍃",
        title: "Organic waste",
        text: "Place food scraps in the designated organic-waste or compost collection bin, if available."
    },
    General: {
        icon: "🗑️",
        title: "General waste",
        text: "Check whether the item can be reused or recycled before placing it in the general-waste bin."
    }
};

function updateAdvice() {
    const category = wasteCategory.value;
    const advice = disposalAdvice[category];

    adviceBox.replaceChildren();

    const icon = document.createElement("div");
    icon.className = "advice-icon";
    icon.textContent = advice.icon;

    const title = document.createElement("h3");
    title.textContent = advice.title;

    const description = document.createElement("p");
    description.textContent = advice.text;

    adviceBox.append(icon, title, description);
}

wasteCategory.addEventListener("change", updateAdvice);
let selectedPhotos = [];

wasteImage.addEventListener("change", function () {
    const newFiles = Array.from(wasteImage.files || []);

    newFiles.forEach(file => {
        if (!file.type.startsWith("image/")) {
            alert("Please select image files only.");
            return;
        }

        const alreadySelected = selectedPhotos.some(photo =>
            photo.name === file.name &&
            photo.size === file.size &&
            photo.lastModified === file.lastModified
        );

        if (!alreadySelected) {
            selectedPhotos.push(file);
        }
    });

    wasteImage.value = "";
    renderPhotoPreviews();
});
function renderPhotoPreviews() {
    imagePreview.replaceChildren();

    selectedPhotos.forEach((file, index) => {
        const item = document.createElement("div");
        item.className = "photo-item";

        const img = document.createElement("img");
        img.alt = `Selected waste photo ${index + 1}`;

        const imageUrl = URL.createObjectURL(file);
        img.src = imageUrl;
        img.addEventListener("load", () => {
            URL.revokeObjectURL(imageUrl);
        }, { once: true });

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-photo";
        removeButton.textContent = "×";
        removeButton.setAttribute("aria-label", "Remove photo");

        removeButton.addEventListener("click", function () {
            selectedPhotos.splice(index, 1);
            renderPhotoPreviews();
        });

        item.append(img, removeButton);
        imagePreview.appendChild(item);
    });
}
wasteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = wasteName.value.trim();

    if (!name) {
        alert("Please enter the waste item name.");
        return;
    }

    const report = {
        name: name,
        category: wasteCategory.value,
        location: wasteLocation.value,
        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
    };

    reports.unshift(report);

    updateDashboard();
    renderReports();
    wasteName.value = "";
    wasteImage.value = "";
    selectedPhotos = [];
    renderPhotoPreviews();

    alert("Waste report added successfully!");
});
   
function updateDashboard() {
    document.getElementById("totalReports").textContent =
        reports.length;

    const recyclable = reports.filter(report =>
        ["Plastic", "Paper", "Metal"].includes(report.category)
    ).length;

    const organic = reports.filter(report =>
        report.category === "Organic"
    ).length;

    document.getElementById("recyclableCount").textContent =
        recyclable;

    document.getElementById("organicCount").textContent =
        organic;

    document.getElementById("reportCountLabel").textContent =
        `${reports.length} report${reports.length === 1 ? "" : "s"}`;
}

function renderReports() {
    reportList.replaceChildren();

    if (reports.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-state";

        const icon = document.createElement("div");
        icon.textContent = "🌿";

        const title = document.createElement("h3");
        title.textContent = "No reports yet";

        const message = document.createElement("p");
        message.textContent = "Add your first waste report above!";

        empty.append(icon, title, message);
        reportList.appendChild(empty);
        return;
    }

    reports.forEach(report => {
        const item = document.createElement("article");
        item.className = "report-item";

        const details = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = report.name;

        const metadata = document.createElement("p");
        metadata.textContent =
            `${report.location} · ${report.time}`;

        details.append(title, metadata);

        const tag = document.createElement("span");
        tag.className = "category-tag";
        tag.textContent = report.category;

        item.append(details, tag);
        reportList.appendChild(item);
    });
}

updateAdvice();
updateDashboard();
renderReports();