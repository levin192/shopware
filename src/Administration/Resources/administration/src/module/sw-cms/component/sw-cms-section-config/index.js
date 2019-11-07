import template from './sw-cms-section-config.html.twig';
import './sw-cms-section-config.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-section-config', {
    template,

    inject: [
        'repositoryFactory',
        'cmsService',
        'apiContext'
    ],

    mixins: [
        Mixin.getByName('cms-state')
    ],

    props: {
        section: {
            type: Object,
            required: true
        }
    },

    computed: {
        uploadTag() {
            return `cms-section-media-config-${this.section.id}`;
        },

        mediaRepository() {
            return this.repositoryFactory.create('media');
        },

        cmsPageState() {
            return this.$store.state.cmsPageState;
        },

        quickactionsDisabled() {
            return !this.isSystemDefaultLanguage;
        },

        quickactionClasses() {
            return {
                'is--disabled': this.quickactionsDisabled
            };
        }
    },

    methods: {
        onSetBackgroundMedia([mediaItem]) {
            this.section.backgroundMediaId = mediaItem.id;
            this.section.backgroundMedia = mediaItem;
        },

        successfulUpload(media) {
            this.section.backgroundMediaId = media.targetId;

            this.mediaRepository.get(media.targetId, this.apiContext).then((mediaItem) => {
                this.section.backgroundMedia = mediaItem;
            });
        },

        removeMedia() {
            this.section.backgroundMediaId = null;
            this.section.backgroundMedia = null;
        },

        onSectionDelete(sectionId) {
            if (this.quickactionsDisabled) {
                return;
            }

            this.$emit('section-delete', sectionId);
        },

        onSectionDuplicate(section) {
            if (this.quickactionsDisabled) {
                return;
            }

            this.$emit('section-duplicate', section);
        }
    }
});
