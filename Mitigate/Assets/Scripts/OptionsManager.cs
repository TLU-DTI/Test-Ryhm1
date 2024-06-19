using UnityEngine;
using UnityEngine.UI;

public class OptionsManager : MonoBehaviour
{
    public GameObject mainMenu;
    public GameObject settingsMenu;
    public Button generalButton;
    public Button audioButton;
    public GameObject generalSettings;
    public GameObject audioSettings;
    private Button selectedButton;

    private void Start() 
    {
        selectedButton = generalButton;
        generalButton.interactable = false;
        audioButton.interactable = true;

        generalButton.onClick.AddListener(SelectGeneralSettings);
        audioButton.onClick.AddListener(SelectAudioSettings);
    }
    public void BackToMenu()
    {
        mainMenu.gameObject.SetActive(true);
        settingsMenu.gameObject.SetActive(false);
    }

    public void OpenOptions()
    {
        mainMenu.gameObject.SetActive(false);
        settingsMenu.gameObject.SetActive(true);
    }

     void SelectGeneralSettings()
    {
        if (selectedButton == generalButton) return;

        generalSettings.SetActive(true);
        audioSettings.SetActive(false);

        generalButton.interactable = false;
        audioButton.interactable = true;

        selectedButton = generalButton;

    }

    void SelectAudioSettings()
    {
        if (selectedButton == audioButton) return;

        generalSettings.SetActive(false);
        audioSettings.SetActive(true);

        generalButton.interactable = true;
        audioButton.interactable = false;

        selectedButton = audioButton;
    }
}
