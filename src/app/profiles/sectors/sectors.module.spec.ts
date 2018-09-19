import { SectorsModule } from './sectors.module';

describe('SectorsModule', () => {
  let sectorsModule: SectorsModule;

  beforeEach(() => {
    sectorsModule = new SectorsModule();
  });

  it('should create an instance', () => {
    expect(sectorsModule).toBeTruthy();
  });
});
