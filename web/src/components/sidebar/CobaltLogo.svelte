<script>
    // логотип теперь просто текст
</script>

<div id="cobalt-logo">
    <span class="logo-text">Save YouTube</span>
</div>

<style>
    #cobalt-logo {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: calc(var(--sidebar-tab-padding) * 2);
        padding-bottom: calc(var(--sidebar-tab-padding) * 2 - var(--sidebar-inner-padding));
    }
    .logo-text {
        font-weight: 700;
        font-size: 1.2rem;
        color: var(--sidebar-highlight);
        letter-spacing: -0.3px;
    }
    @media screen and (max-width: 535px) {
        #cobalt-logo {
            display: none;
        }
    }
</style>