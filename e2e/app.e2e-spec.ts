import { VCSdrawerPage } from './app.po';

describe('vcsdrawer App', () => {
  let page: VCSdrawerPage;

  beforeEach(() => {
    page = new VCSdrawerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
