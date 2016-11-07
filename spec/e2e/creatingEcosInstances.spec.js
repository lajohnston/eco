describe('Ecos', () => {
    it('should expose an Ecos global variable', () => {
        expect(window.Ecos).toBeDefined();
        expect(new Ecos()).toBeDefined();
    });
});
