import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { LmsUiContentCreateComponent } from './lms-ui-content-create.component';

export default {
  title: 'LmsUiContentCreateComponent',
  component: LmsUiContentCreateComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<LmsUiContentCreateComponent>;

const Template: StoryFn<LmsUiContentCreateComponent> = (args: LmsUiContentCreateComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
