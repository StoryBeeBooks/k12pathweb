/**
 * Word Quest - Shop Module
 * Handles the collectibles shop functionality
 */

const Shop = {
    currentCategory: 'all',
    selectedCollectionCategory: 'all',
    
    /**
     * Initialize the shop
     */
    init() {
        this.renderCategories();
        this.renderItems();
        this.updateOwnedCount();
    },

    /**
     * Render category tabs
     */
    renderCategories() {
        const container = document.getElementById('shopCategories');
        if (!container) return;

        let html = `<button class="category-tab active" data-category="all">🛒 All</button>`;
        
        COLLECTIBLES_DATA.categories.forEach(cat => {
            html += `<button class="category-tab" data-category="${cat.id}">${cat.icon}</button>`;
        });

        container.innerHTML = html;

        // Add click handlers
        container.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                container.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentCategory = tab.dataset.category;
                this.renderItems();
            });
        });
    },

    /**
     * Render shop items
     */
    renderItems() {
        const container = document.getElementById('shopItems');
        if (!container) return;

        const ownedItems = this.getOwnedItems();
        const stats = Storage.getStats();
        const currentXP = stats.totalXP;

        let items = COLLECTIBLES_DATA.items;
        
        // Filter by category
        if (this.currentCategory !== 'all') {
            items = items.filter(item => item.category === this.currentCategory);
        }

        // Sort by price
        items.sort((a, b) => a.price - b.price);

        let html = '';
        items.forEach(item => {
            const owned = ownedItems.includes(item.id);
            const canAfford = currentXP >= item.price;
            const rarity = COLLECTIBLES_DATA.rarities[item.rarity];

            html += `
                <div class="shop-item ${owned ? 'owned' : ''} ${!canAfford && !owned ? 'cant-afford' : ''}" 
                     data-item-id="${item.id}"
                     style="--rarity-color: ${rarity.color}">
                    <div class="item-emoji">${item.emoji}</div>
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-rarity" style="color: ${rarity.color}">${rarity.label}</div>
                    </div>
                    <div class="item-price">
                        ${owned ? '<span class="owned-badge">✓ Owned</span>' : `<span class="price-tag">⭐ ${item.price}</span>`}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html || '<p class="no-items">No items in this category</p>';

        // Add click handlers for purchasing
        container.querySelectorAll('.shop-item:not(.owned)').forEach(itemEl => {
            itemEl.addEventListener('click', () => {
                const itemId = itemEl.dataset.itemId;
                this.purchaseItem(itemId);
            });
        });
    },

    /**
     * Purchase an item
     */
    purchaseItem(itemId) {
        const item = COLLECTIBLES_DATA.items.find(i => i.id === itemId);
        if (!item) return;

        const stats = Storage.getStats();
        const ownedItems = this.getOwnedItems();

        // Check if already owned
        if (ownedItems.includes(itemId)) {
            this.showMessage('You already own this item!', 'info');
            return;
        }

        // Check if can afford
        if (stats.totalXP < item.price) {
            this.showMessage(`Not enough XP! You need ${item.price - stats.totalXP} more.`, 'error');
            return;
        }

        // Show custom confirmation modal (prevents iOS "suppress dialogs" issue)
        this.showPurchaseModal(item, stats);
    },

    /**
     * Show custom purchase confirmation modal
     */
    showPurchaseModal(item, stats) {
        const modal = document.getElementById('purchaseModal');
        if (!modal) {
            // Fallback to confirm if modal doesn't exist
            if (confirm(`Buy "${item.name}" for ⭐${item.price} XP?`)) {
                this.completePurchase(item);
            }
            return;
        }

        // Populate modal with item details
        document.getElementById('purchaseItemEmoji').textContent = item.emoji;
        document.getElementById('purchaseItemName').textContent = item.name;
        document.getElementById('purchasePrice').textContent = `⭐ ${item.price}`;
        document.getElementById('purchaseBalance').textContent = `⭐ ${stats.totalXP}`;
        document.getElementById('purchaseRemaining').textContent = `⭐ ${stats.totalXP - item.price}`;

        // Show modal
        modal.classList.add('active');

        // Set up button handlers (remove old ones first)
        const confirmBtn = document.getElementById('purchaseConfirmBtn');
        const cancelBtn = document.getElementById('purchaseCancelBtn');
        
        const newConfirmBtn = confirmBtn.cloneNode(true);
        const newCancelBtn = cancelBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        newConfirmBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            this.completePurchase(item);
        });

        newCancelBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    },

    /**
     * Complete the purchase after confirmation
     */
    completePurchase(item) {
        const stats = Storage.getStats();
        const ownedItems = this.getOwnedItems();

        // Deduct XP
        stats.totalXP -= item.price;
        Storage.saveStats(stats);

        // Add to owned items
        ownedItems.push(item.id);
        this.saveOwnedItems(ownedItems);

        // Update UI
        this.renderItems();
        this.updateOwnedCount();
        this.renderCollection();
        App.updateStats();

        // Show celebration
        this.showMessage(`🎉 You got "${item.name}"!`, 'success');
        Audio.playSuccess();
    },

    /**
     * Get owned items from storage
     */
    getOwnedItems() {
        try {
            const data = localStorage.getItem('wordquest_collectibles');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    /**
     * Get all categories with 'All' prepended
     */
    getCategories() {
        const categories = [{ id: 'all', name: 'All', icon: '🛒' }];
        if (COLLECTIBLES_DATA && COLLECTIBLES_DATA.categories) {
            categories.push(...COLLECTIBLES_DATA.categories);
        }
        return categories;
    },

    /**
     * Save owned items to storage
     */
    saveOwnedItems(items) {
        localStorage.setItem('wordquest_collectibles', JSON.stringify(items));
    },

    /**
     * Update owned count display
     */
    updateOwnedCount() {
        const owned = this.getOwnedItems().length;
        const total = COLLECTIBLES_DATA.items.length;
        const countEl = document.getElementById('ownedCount');
        if (countEl) {
            countEl.textContent = `${owned}/${total}`;
        }
    },

    /**
     * Show a message to the user
     */
    showMessage(message, type = 'info') {
        const msgEl = document.getElementById('shopMessage');
        if (!msgEl) return;

        msgEl.textContent = message;
        msgEl.className = `shop-message ${type}`;
        msgEl.classList.remove('hidden');

        setTimeout(() => {
            msgEl.classList.add('hidden');
        }, 3000);
    },

    /**
     * Toggle shop panel visibility
     */
    toggle() {
        const panel = document.getElementById('shopPanel');
        if (panel) {
            panel.classList.toggle('open');
            if (panel.classList.contains('open')) {
                this.init();
            }
        }
    },

    /**
     * Update XP display in shop panel
     */
    updateXPDisplay() {
        const stats = Storage.getStats();
        const xpEl = document.getElementById('shopXP');
        if (xpEl) {
            xpEl.textContent = `${stats.totalXP.toLocaleString()} ⭐`;
        }
        // Re-render items to update affordability
        this.renderItems();
        this.updateOwnedCount();
    },

    /**
     * Render the collection showcase on home screen
     */
    renderCollection() {
        const container = document.getElementById('collectionItems');
        const categoriesContainer = document.getElementById('collectionCategories');
        const countEl = document.getElementById('collectionOwned');
        const totalEl = document.getElementById('collectionTotal');
        
        if (!container) return;

        const ownedIds = this.getOwnedItems();
        const totalItems = COLLECTIBLES_DATA.items.length;
        
        // Update total count
        if (countEl) countEl.textContent = ownedIds.length;
        if (totalEl) totalEl.textContent = totalItems;

        // Render category progress bars
        if (categoriesContainer) {
            this.renderCategoryProgress(categoriesContainer, ownedIds);
        }

        // If no items, show empty state
        if (ownedIds.length === 0) {
            container.innerHTML = `
                <div class="empty-collection">
                    <span class="empty-icon">🛒</span>
                    <p>No items yet! Earn XP and visit the shop to collect items.</p>
                </div>
            `;
            return;
        }

        // Filter by selected category
        let itemsToShow = COLLECTIBLES_DATA.items.filter(item => ownedIds.includes(item.id));
        
        if (this.selectedCollectionCategory !== 'all') {
            itemsToShow = itemsToShow.filter(item => item.category === this.selectedCollectionCategory);
        }

        // Sort by rarity (legendary first)
        const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
        itemsToShow.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

        // Show empty category message if no items in selected category
        if (itemsToShow.length === 0 && this.selectedCollectionCategory !== 'all') {
            const cat = COLLECTIBLES_DATA.categories.find(c => c.id === this.selectedCollectionCategory);
            container.innerHTML = `<p class="empty-category-msg">No ${cat?.icon || ''} items collected yet!</p>`;
            return;
        }

        // Render items
        let html = '';
        itemsToShow.forEach((item, index) => {
            html += `
                <div class="collection-item ${item.rarity}" 
                     data-name="${item.name}"
                     style="animation-delay: ${index * 0.03}s"
                     title="${item.name} (${COLLECTIBLES_DATA.rarities[item.rarity].label})">
                    ${item.emoji}
                </div>
            `;
        });

        container.innerHTML = html;
    },

    /**
     * Render category progress bars
     */
    renderCategoryProgress(container, ownedIds) {
        // Add "All" category at the start
        let html = `
            <div class="category-progress ${this.selectedCollectionCategory === 'all' ? 'active' : ''}" 
                 data-category="all">
                <div class="category-info">
                    <span class="category-icon">🏆</span>
                    <span class="category-name">All Items</span>
                </div>
                <div class="category-stats">
                    <span class="category-owned">${ownedIds.length}</span>
                    <span class="category-total">/ ${COLLECTIBLES_DATA.items.length}</span>
                </div>
                <div class="category-bar">
                    <div class="category-bar-fill" style="width: ${(ownedIds.length / COLLECTIBLES_DATA.items.length * 100).toFixed(1)}%"></div>
                </div>
            </div>
        `;

        COLLECTIBLES_DATA.categories.forEach(cat => {
            const categoryItems = COLLECTIBLES_DATA.items.filter(item => item.category === cat.id);
            const ownedInCategory = categoryItems.filter(item => ownedIds.includes(item.id)).length;
            const totalInCategory = categoryItems.length;
            const percentage = totalInCategory > 0 ? (ownedInCategory / totalInCategory * 100) : 0;
            const isComplete = ownedInCategory === totalInCategory && totalInCategory > 0;
            const isActive = this.selectedCollectionCategory === cat.id;

            html += `
                <div class="category-progress ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}" 
                     data-category="${cat.id}">
                    <div class="category-info">
                        <span class="category-icon">${cat.icon}</span>
                        <span class="category-name">${cat.name.split(' ').slice(1).join(' ')}</span>
                    </div>
                    <div class="category-stats">
                        <span class="category-owned">${ownedInCategory}</span>
                        <span class="category-total">/ ${totalInCategory}</span>
                    </div>
                    <div class="category-bar">
                        <div class="category-bar-fill" style="width: ${percentage.toFixed(1)}%"></div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Add click handlers for filtering
        container.querySelectorAll('.category-progress').forEach(el => {
            el.addEventListener('click', () => {
                this.selectedCollectionCategory = el.dataset.category;
                this.renderCollection();
            });
        });
    }
};
