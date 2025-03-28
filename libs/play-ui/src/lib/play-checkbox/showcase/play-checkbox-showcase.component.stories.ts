import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { PlayCheckboxShowcaseComponent } from './play-checkbox-showcase.component';

export default {
  title: 'PlayCheckboxShowcase',
  component: PlayCheckboxShowcaseComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<PlayCheckboxShowcaseComponent>;

const Template: StoryFn<PlayCheckboxShowcaseComponent> = (args: PlayCheckboxShowcaseComponent) => ({
  props: args,
});

export const Showcase = Template.bind({});
Showcase.args = {};
