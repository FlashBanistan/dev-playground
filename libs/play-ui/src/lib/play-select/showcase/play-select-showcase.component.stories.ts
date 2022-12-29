import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { PlaySelectShowcaseComponent } from './play-select-showcase.component';

export default {
  title: 'PlaySelectShowcase',
  component: PlaySelectShowcaseComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<PlaySelectShowcaseComponent>;

const Template: Story<PlaySelectShowcaseComponent> = (
  args: PlaySelectShowcaseComponent
) => ({
  props: args,
});

export const Showcase = Template.bind({});
Showcase.args = {};
